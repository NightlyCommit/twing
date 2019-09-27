import {TwingErrorRuntime} from "./error/runtime";
import {TwingSource} from "./source";
import {TwingNodeBlock} from "./node/block";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {flush, echo, obGetLevel, obStart, obEndClean, obGetClean, obGetContents} from './output-buffering';
import {iteratorToMap} from "./helpers/iterator-to-map";
import {merge} from "./helpers/merge";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingContext} from "./context";
import {isMap} from "./helpers/is-map";
import {TwingErrorLoader} from "./error/loader";
import {TwingMarkup} from "./markup";
import {TwingSandboxSecurityError} from "./sandbox/security-error";
import {TwingSandboxSecurityNotAllowedFilterError} from "./sandbox/security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./sandbox/security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./sandbox/security-not-allowed-tag-error";
import {compare} from "./helpers/compare";
import {count} from "./helpers/count";
import {isCountable} from "./helpers/is-countable";
import {isPlainObject} from "./helpers/is-plain-object";
import {iterate} from "./helpers/iterate";
import {isIn} from "./helpers/is-in";
import {ensureTraversable} from "./helpers/ensure-traversable";
import {getAttribute} from "./helpers/get-attribute";
import {createRange} from "./helpers/create-range";
import {cloneMap} from "./helpers/clone-map";
import {parseRegex} from "./helpers/parse-regex";
import {constant} from "./extension/core/functions/constant";
import {callMacro} from "./helpers/call-macro";
import {get} from "./helpers/get";
import {include} from "./extension/core/functions/include";

/**
 * Default base class for compiled templates.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    protected parent: TwingTemplate | false = null;
    protected parents: Map<TwingTemplate | string, TwingTemplate> = new Map();
    protected env: TwingEnvironment;
    protected blocks: Map<string, Array<any>> = new Map();
    protected traits: Map<string, Array<any>> = new Map();

    /**
     * @internal
     */
    protected extensions: Map<string, TwingExtensionInterface> = new Map();

    protected constructor(env: TwingEnvironment) {
        this.env = env;
        this.extensions = env.getExtensions();
    }

    /**
     * @internal this method will be removed in 2.0 and is only used internally to provide an upgrade path from 1.x to 2.0
     */
    toString() {
        return this.getTemplateName();
    }

    /**
     * Returns the template name.
     *
     * @returns {string} The template name
     */
    abstract getTemplateName(): string;

    /**
     * Returns information about the original template source code.
     *
     * @return TwingSource
     */
    getSourceContext(): TwingSource {
        return new TwingSource('', this.getTemplateName());
    }

    /**
     * Returns the parent template.
     *
     * @param context
     *
     * @returns TwingTemplate|false The parent template or false if there is no parent
     */
    getParent(context: any = {}) {
        if (this.parent !== null) {
            return this.parent;
        }

        let parent: TwingTemplate | string | false;

        try {
            parent = this.doGetParent(context);

            if (parent === false) {
                return false;
            }

            if (parent instanceof TwingTemplate) {
                this.parents.set(parent.getSourceContext().getName(), parent);
            }

            if (!this.parents.has(parent)) {
                this.parents.set(parent, this.loadTemplate(parent as string) as TwingTemplate);
            }
        } catch (e) {
            if (e instanceof TwingError) {
                e.setSourceContext(null);
            }

            throw e;
        }

        return this.parents.get(parent);
    }

    isTraitable() {
        return true;
    }

    /**
     * Displays a parent block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display from the parent
     * @param context The context
     * @param {Map<string, TwingNodeBlock>} blocks The active set of blocks
     * @returns {string}
     *
     * @internal
     */
    displayParentBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()) {
        let parent;

        if (this.traits.has(name)) {
            (this.traits.get(name)[0] as TwingTemplate).displayBlock(name, context, blocks, false);
        } else if ((parent = this.getParent(context) as TwingTemplate | false) !== false) {
            (<TwingTemplate>parent).displayBlock(name, context, blocks, false);
        } else {
            throw new TwingErrorRuntime(`The template has no parent and no traits defining the "${name}" block.`, -1, this.getSourceContext());
        }
    }

    /**
     * Displays a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @internal
     */
    displayBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map(), useBlocks = true): void {
        let block: string;
        let template: TwingTemplate;
        let parent: TwingTemplate | false;

        if (useBlocks && blocks.has(name)) {
            template = blocks.get(name)[0];
            block = blocks.get(name)[1];
        } else if (this.blocks.has(name)) {
            template = this.blocks.get(name)[0];
            block = this.blocks.get(name)[1];
        } else {
            template = null;
            block = null;
        }

        if (template !== null) {
            Reflect.get(template, block).call(template, context, blocks);
        } else if ((parent = this.getParent(context) as TwingTemplate | false) !== false) {
            parent.displayBlock(name, context, merge(this.blocks, blocks) as Map<string, Array<any>>, false);
        } else if (blocks.has(name)) {
            throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].getTemplateName()}" as the block does not exist in the parent template "${this.getTemplateName()}".`, -1, blocks.get(name)[0].getSourceContext());
        } else {
            throw new TwingErrorRuntime(`Block "${name}" on template "${this.getTemplateName()}" does not exist.`, -1, this.getSourceContext());
        }
    }

    /**
     * Renders a parent block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display from the parent
     * @param {*} context The context
     * @param {Map<string, Array<any>>} blocks The active set of blocks
     *
     * @returns string The rendered block
     *
     * @internal
     */
    renderParentBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()) {
        obStart();

        this.displayParentBlock(name, context, blocks);

        return obGetClean() as string;
    }

    /**
     * Renders a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @return string The rendered block
     *
     * @internal
     */
    renderBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks = true): string {
        obStart();

        this.displayBlock(name, context, blocks, useBlocks);

        return obGetClean() as string;
    }

    /**
     * Returns whether a block exists or not in the active context of the template.
     *
     * This method checks blocks defined in the active template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name The block name
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     *
     * @returns {boolean} true if the block exists, false otherwise
     */
    hasBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()): boolean {
        if (blocks.has(name)) {
            return blocks.get(name)[0] instanceof TwingTemplate;
        }

        if (this.blocks.has(name)) {
            return true;
        }

        let parent = this.getParent(context) as any;

        if (parent) {
            return parent.hasBlock(name, context);
        }

        return false;
    }

    public loadTemplate(templates: TwingTemplate | Map<number, TwingTemplate> | string, templateName: string = null, line: number = null, index: number = 0): TwingTemplate {
        try {
            if (typeof templates === 'string') {
                return this.env.loadTemplate(templates, index, this.getSourceContext());
            }

            if (templates instanceof TwingTemplate) {
                return templates;
            }

            return this.env.resolveTemplate([...templates.values()], this.getSourceContext());
        } catch (e) {
            if (e instanceof TwingError) {
                if (e.getTemplateLine() !== -1) {
                    throw e;
                }

                if (line) {
                    e.setTemplateLine(line);
                }
            }

            throw e;
        }
    }

    /**
     * Returns all blocks.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @returns {Map<string, Array<*>>} An array of blocks
     *
     * @internal
     */
    getBlocks() {
        return this.blocks;
    }

    display(context: any, blocks: Map<string, Array<any>> = new Map()) {
        if (context === null) {
            throw new TypeError('Argument 1 passed to TwingTemplate::display() must be an iterator, null given');
        }

        if (!isMap(context)) {
            context = iteratorToMap(context);
        }

        context = new TwingContext(this.env.mergeGlobals(context));

        this.displayWithErrorHandling(context, merge(this.blocks, blocks) as Map<string, Array<any>>);
    }

    render(context: any): string {
        let level = obGetLevel();

        obStart();

        try {
            this.display(context);
        } catch (e) {
            while (obGetLevel() > level) {
                obEndClean();
            }

            throw e;
        }

        return obGetClean() as string;
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {*} context An array of parameters to pass to the template
     * @param {Map<string, Array<*>>} blocks  An array of blocks to pass to the template
     */
    abstract doDisplay(context: {}, blocks: Map<string, Array<any>>): void;

    protected doGetParent(context: any): TwingTemplate | string | false {
        return false;
    }

    protected displayWithErrorHandling(context: any, blocks: Map<string, Array<any>> = new Map()) {
        try {
            this.doDisplay(context, blocks);
        } catch (e) {
            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(this.getSourceContext());
                }

                throw e;
            }

            throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e);
        }
    }

    public traceableMethod(method: Function, lineno: number, source: TwingSource) {
        return function () {
            try {
                return method.apply(null, arguments);
            } catch (e) {
                if (e instanceof TwingError) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(lineno);
                        e.setSourceContext(source);
                    }
                } else {
                    e = new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, lineno, source, e);
                }

                throw e;
            }
        }
    };

    public traceableDisplayBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.displayBlock.bind(this), lineno, source);
    };

    public traceableDisplayParentBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.displayParentBlock.bind(this), lineno, source);
    };

    public traceableRenderBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.renderBlock.bind(this), lineno, source);
    }

    public traceableRenderParentBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.renderParentBlock.bind(this), lineno, source);
    }

    public traceableHasBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.hasBlock.bind(this), lineno, source);
    }

    protected get callMacro(): (template: TwingTemplate, method: string, args: any[], lineno: number, context: TwingContext<any, any>, source: TwingSource) => void {
        return callMacro;
    }

    protected get cloneMap(): <K, V>(m: Map<K, V>) => Map<K, V> {
        return cloneMap;
    }

    protected get compare(): (a: any, b: any) => boolean {
        return compare;
    }

    protected get constant(): (env: TwingEnvironment, name: string, object: any) => any {
        return constant;
    }

    protected get convertToMap(): (iterable: any) => Map<any, any> {
        return iteratorToMap;
    }

    protected get count(): (a: any) => number {
        return count;
    }

    protected get createRange(): (low: any, high: any, step: number) => Map<number, any> {
        return createRange;
    }

    protected get echo(): (value: any) => void {
        return echo;
    }

    protected get endAndCleanOutputBuffer(): () => boolean {
        return obEndClean;
    }

    protected get ensureTraversable(): <T>(candidate: T[]) => T[] | [] {
        return ensureTraversable;
    }

    protected get flushOutputBuffer(): () => void {
        return flush;
    }

    protected get get(): (object: any, property: any) => any {
        return (object: any, property: any): any => {
            if (isMap(object) || isPlainObject(object)) {
                return get(object, property);
            }
        };
    }

    protected get getAndCleanOutputBuffer(): () => string | false {
        return obGetClean;
    }

    protected get getAttribute(): (env: TwingEnvironment, object: any, item: any, _arguments: Map<any, any>, type: string, isDefinedTest: boolean, ignoreStrictCheck: boolean, sandboxed: boolean) => any {
        return getAttribute;
    }

    protected get getOutputBufferContent(): () => string | false {
        return obGetContents;
    }

    protected get include(): (context: any, from: TwingSource, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any, withContext: boolean, ignoreMissing: boolean, line: number) => string {
        return (context: any, from: TwingSource, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any, withContext: boolean, ignoreMissing: boolean, line: number): string => {
            try {
                return include(this.env, context, from, templates, variables, withContext, ignoreMissing);
            }
            catch (e) {
                if (e instanceof TwingError) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(line);
                    }
                }

                throw e;
            }
        }
    }

    protected get isCountable(): (candidate: any) => boolean {
        return isCountable;
    }

    protected get isIn(): (a: any, b: any) => boolean {
        return isIn;
    }

    protected get iterate(): (it: any, cb: <K, V>(k: K, v: V) => void) => void {
        return iterate;
    }

    protected get merge(): (iterable1: Array<any> | Map<any, any>, iterable2: Array<any> | Map<any, any>) => Array<any> | Map<any, any> {
        return merge;
    }

    protected get parseRegExp(): (input: string) => RegExp {
        return parseRegex;
    }

    protected get startOutputBuffer(): () => boolean {
        return obStart;
    }

    protected get Context(): typeof TwingContext {
        return TwingContext;
    }

    protected get Markup(): typeof TwingMarkup {
        return TwingMarkup;
    }

    protected get RuntimeError(): typeof TwingErrorRuntime {
        return TwingErrorRuntime;
    }

    protected get SandboxSecurityError(): typeof TwingSandboxSecurityError {
        return TwingSandboxSecurityError;
    }

    protected get SandboxSecurityNotAllowedFilterError(): typeof TwingSandboxSecurityNotAllowedFilterError {
        return TwingSandboxSecurityNotAllowedFilterError;
    }

    protected get SandboxSecurityNotAllowedFunctionError(): typeof TwingSandboxSecurityNotAllowedFunctionError {
        return TwingSandboxSecurityNotAllowedFunctionError;
    }

    protected get SandboxSecurityNotAllowedTagError(): typeof TwingSandboxSecurityNotAllowedTagError {
        return TwingSandboxSecurityNotAllowedTagError;
    }

    protected get Source(): typeof TwingSource {
        return TwingSource;
    }
}
