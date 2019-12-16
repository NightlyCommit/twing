import {TwingErrorRuntime} from "./error/runtime";
import {TwingSource} from "./source";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {flush, echo, obGetLevel, obStart, obEndClean, obGetClean, obGetContents} from './output-buffering';
import {iteratorToMap} from "./helpers/iterator-to-map";
import {merge} from "./helpers/merge";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingContext} from "./context";
import {isMap} from "./helpers/is-map";
import {TwingMarkup} from "./markup";
import {TwingSandboxSecurityError} from "./sandbox/security-error";
import {TwingSandboxSecurityNotAllowedFilterError} from "./sandbox/security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./sandbox/security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./sandbox/security-not-allowed-tag-error";
import {compare} from "./helpers/compare";
import {count} from "./helpers/count";
import {isCountable} from "./helpers/is-countable";
import {isPlainObject} from "./helpers/is-plain-object";
import {iterate, IterateCallback} from "./helpers/iterate";
import {isIn} from "./helpers/is-in";
import {ensureTraversable} from "./helpers/ensure-traversable";
import {getAttribute} from "./helpers/get-attribute";
import {createRange} from "./helpers/create-range";
import {cloneMap} from "./helpers/clone-map";
import {parseRegex} from "./helpers/parse-regex";
import {constant} from "./helpers/constant";
import {get} from "./helpers/get";
import {include} from "./extension/core/functions/include";
import {isNullOrUndefined} from "util";

type TwingTemplateMacrosMap = Map<string, TwingTemplateMacroHandler>;
type TwingTemplateAliasesMap = TwingContext<string, TwingTemplate>;
type TwingTemplateTraceableMethod<T> = (...args: Array<any>) => Promise<T>;

export type TwingTemplateBlocksMap = Map<string, [TwingTemplate, string]>;
export type TwingTemplateBlockHandler = (context: any, blocks: TwingTemplateBlocksMap) => Promise<void>;
export type TwingTemplateMacroHandler = (...args: Array<any>) => Promise<string>;

/**
 * Default base class for compiled templates.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    protected parent: TwingTemplate | false;
    protected parents: Map<TwingTemplate | string, TwingTemplate>;
    protected env: TwingEnvironment;
    protected blocks: TwingTemplateBlocksMap;
    protected blockHandlers: Map<string, TwingTemplateBlockHandler>;
    protected macroHandlers: Map<string, TwingTemplateMacroHandler>;
    protected traits: TwingTemplateBlocksMap;
    protected macros: TwingTemplateMacrosMap;
    protected aliases: TwingTemplateAliasesMap;
    protected extensions: Map<string, TwingExtensionInterface>;
    protected sourceContext: TwingSource;

    constructor(env: TwingEnvironment) {
        this.env = env;
        this.parents = new Map();
        this.aliases = new TwingContext();
        this.extensions = env.getExtensions();
        this.blockHandlers = new Map();
        this.macroHandlers = new Map();
    }

    /**
     * Returns the template name.
     *
     * @returns {string} The template name
     */
    getTemplateName(): string {
        return this.getSourceContext().getName();
    }

    /**
     * @returns {TwingSource}
     */
    getSourceContext(): TwingSource {
        return this.sourceContext;
    }

    /**
     * Returns the parent template.
     *
     * @param {any} context
     *
     * @returns {Promise<TwingTemplate|false>} The parent template or false if there is no parent
     */
    getParent(context: any = {}): Promise<TwingTemplate | false> {
        if (this.parent) {
            return Promise.resolve(this.parent);
        }

        return this.doGetParent(context)
            .then((parent) => {
                if (parent === false || parent instanceof TwingTemplate) {
                    if (parent instanceof TwingTemplate) {
                        this.parents.set(parent.getSourceContext().getName(), parent);
                    }

                    return parent;
                }

                // parent is a string
                if (!this.parents.has(parent)) {
                    return this.loadTemplate(parent)
                        .then((template: TwingTemplate) => {
                            this.parents.set(parent, template);

                            return template;
                        });
                } else {
                    return this.parents.get(parent);
                }
            });
    }

    /**
     * Returns template blocks.
     *
     * @returns {Promise<TwingTemplateBlocksMap>} A map of blocks
     */
    getBlocks(): Promise<TwingTemplateBlocksMap> {
        if (this.blocks) {
            return Promise.resolve(this.blocks);
        } else {
            return this.getTraits().then((traits) => {
                this.blocks = merge(traits, new Map([...this.blockHandlers.keys()].map((key) => [key, [this, key]])));

                return this.blocks;
            });
        }
    }

    isTraitable() {
        return true;
    }

    /**
     * Displays a block.
     *
     * @param {string} name The block name to display
     * @param {any} context The context
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @returns {Promise<void>}
     */
    protected displayBlock(name: string, context: any, blocks: TwingTemplateBlocksMap = new Map(), useBlocks = true): Promise<void> {
        return this.getBlocks().then((ownBlocks) => {
            let blockHandler: TwingTemplateBlockHandler;

            if (useBlocks && blocks.has(name)) {
                blockHandler = blocks.get(name)[0].blockHandlers.get(blocks.get(name)[1]);
            } else if (ownBlocks.has(name)) {
                blockHandler = ownBlocks.get(name)[0].blockHandlers.get(ownBlocks.get(name)[1]);
            }

            if (blockHandler) {
                return blockHandler(context, blocks);
            } else {
                return this.getParent(context).then((parent) => {
                    if (parent) {
                        return parent.displayBlock(name, context, merge(ownBlocks, blocks), false);
                    } else if (blocks.has(name)) {
                        throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].getTemplateName()}" as the block does not exist in the parent template "${this.getTemplateName()}".`, -1, blocks.get(name)[0].getSourceContext());
                    } else {
                        throw new TwingErrorRuntime(`Block "${name}" on template "${this.getTemplateName()}" does not exist.`, -1, this.getSourceContext());
                    }
                });

            }
        });
    }

    /**
     * Displays a parent block.
     *
     * @param {string} name The block name to display from the parent
     * @param {any} context The context
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     *
     * @returns {Promise<void>}
     */
    protected displayParentBlock(name: string, context: any, blocks: TwingTemplateBlocksMap): Promise<void> {
        return this.getTraits().then((traits) => {
            if (traits.has(name)) {
                return traits.get(name)[0].displayBlock(traits.get(name)[1], context, blocks, false);
            } else {
                return this.getParent(context).then((template) => {
                    if (template !== false) {
                        return template.displayBlock(name, context, blocks, false);
                    } else {
                        throw new TwingErrorRuntime(`The template has no parent and no traits defining the "${name}" block.`, -1, this.getSourceContext());
                    }
                });
            }
        });
    }

    /**
     * Renders a parent block.
     *
     * @param {string} name The block name to display from the parent
     * @param {*} context The context
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     *
     * @returns {Promise<string>} The rendered block
     */
    protected renderParentBlock(name: string, context: any, blocks: TwingTemplateBlocksMap): Promise<string> {
        obStart();

        return this.getBlocks().then((blocks) => {
            return this.displayParentBlock(name, context, blocks).then(() => {
                return obGetClean() as string;
            })
        });
    }

    /**
     * Renders a block.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @return {Promise<string>} The rendered block
     */
    protected renderBlock(name: string, context: any, blocks: TwingTemplateBlocksMap = new Map(), useBlocks = true): Promise<string> {
        obStart();

        return this.displayBlock(name, context, blocks, useBlocks).then(() => {
            return obGetClean() as string;
        });
    }

    /**
     * Returns whether a block exists or not in the active context of the template.
     *
     * This method checks blocks defined in the active template or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name The block name
     * @param {any} context The context
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     *
     * @return {Promise<boolean>} true if the block exists, false otherwise
     */
    hasBlock(name: string, context: any, blocks: TwingTemplateBlocksMap = new Map()): Promise<boolean> {
        if (blocks.has(name)) {
            return Promise.resolve(true);
        } else {
            return this.getBlocks().then((blocks) => {
                if (blocks.has(name)) {
                    return Promise.resolve(true);
                } else {
                    return this.getParent(context).then((parent) => {
                        if (parent) {
                            return parent.hasBlock(name, context);
                        } else {
                            return false;
                        }
                    });
                }
            })
        }
    }

    /**
     * @param {string} name The macro name
     *
     * @return {Promise<boolean>}
     */
    hasMacro(name: string): Promise<boolean> {
        // @see https://github.com/twigphp/Twig/issues/3174 as to why we don't check macro existence in parents
        return Promise.resolve(this.macroHandlers.has(name));
    }

    loadTemplate(templates: TwingTemplate | Map<number, TwingTemplate> | string, line: number = null, index: number = 0): Promise<TwingTemplate> {
        let promise: Promise<TwingTemplate>;

        if (typeof templates === 'string') {
            promise = this.env.loadTemplate(templates, index, this.getSourceContext());
        } else if (templates instanceof TwingTemplate) {
            promise = Promise.resolve(templates);
        } else {
            promise = this.env.resolveTemplate([...templates.values()], this.getSourceContext());
        }

        return promise.catch((e) => {
            if (e instanceof TwingError) {
                if (e.getTemplateLine() !== -1) {
                    throw e;
                }

                if (line) {
                    e.setTemplateLine(line);
                }
            }

            throw e;
        });
    }

    /**
     * Returns template traits.
     *
     * @returns {Promise<TwingTemplateBlocksMap>} A map of traits
     */
    getTraits(): Promise<TwingTemplateBlocksMap> {
        if (this.traits) {
            return Promise.resolve(this.traits);
        } else {
            return this.doGetTraits().then((traits) => {
                this.traits = traits;

                return traits;
            });
        }
    }

    protected doGetTraits(): Promise<TwingTemplateBlocksMap> {
        return Promise.resolve(new Map());
    }

    display(context: any, blocks: TwingTemplateBlocksMap = new Map()): Promise<void> {
        if (context === null) {
            throw new TypeError('Argument 1 passed to TwingTemplate::display() must be an iterator, null given');
        }

        if (!isMap(context)) {
            context = iteratorToMap(context);
        }

        context = new TwingContext(this.env.mergeGlobals(context));

        return this.getBlocks().then((ownBlocks) => this.displayWithErrorHandling(context, merge(ownBlocks, blocks)));
    }

    protected displayWithErrorHandling(context: any, blocks: TwingTemplateBlocksMap = new Map()): Promise<void> {
        return this.doDisplay(context, blocks).catch((e) => {

            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(this.getSourceContext());
                }
            } else {
                e = new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e);
            }

            throw e;
        });
    }

    render(context: any): Promise<string> {
        let level = obGetLevel();

        obStart();

        return this.display(context)
            .then(() => {
                return obGetClean() as string;
            })
            .catch((e) => {
                while (obGetLevel() > level) {
                    obEndClean();
                }

                throw e;
            })
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {any} context An array of parameters to pass to the template
     * @param {TwingTemplateBlocksMap} blocks
     */
    protected abstract doDisplay(context: any, blocks: TwingTemplateBlocksMap): Promise<void>;

    protected doGetParent(context: any): Promise<TwingTemplate | string | false> {
        return Promise.resolve(false);
    }

    protected callMacro(template: TwingTemplate, name: string, args: any[], lineno: number, context: TwingContext<any, any>, source: TwingSource): Promise<string> {
        let getHandler = (template: TwingTemplate): Promise<TwingTemplateMacroHandler> => {
            if (template.macroHandlers.has(name)) {
                return Promise.resolve(template.macroHandlers.get(name));
            } else {
                return template.getParent(context).then((parent) => {
                    if (parent) {
                        return getHandler(parent);
                    } else {
                        return null;
                    }
                });
            }
        };

        return getHandler(template).then((handler) => {
            if (handler) {
                return handler(...args);
            } else {
                throw new TwingErrorRuntime(`Macro "${name}" is not defined in template "${template.getTemplateName()}".`, lineno, source);
            }
        });
    }

    public traceableMethod<T>(method: Function, lineno: number, source: TwingSource): TwingTemplateTraceableMethod<T> {
        return function () {
            return (method.apply(null, arguments) as Promise<T>).catch((e) => {
                if (e instanceof TwingError) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(lineno);
                        e.setSourceContext(source);
                    }
                } else {
                    throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, lineno, source, e);
                }

                throw e;
            });
        }
    }

    public traceableDisplayBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<void> {
        return this.traceableMethod(this.displayBlock.bind(this), lineno, source);
    }

    public traceableDisplayParentBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<void> {
        return this.traceableMethod(this.displayParentBlock.bind(this), lineno, source);
    }

    public traceableRenderBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<string> {
        return this.traceableMethod(this.renderBlock.bind(this), lineno, source);
    }

    public traceableRenderParentBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<string> {
        return this.traceableMethod(this.renderParentBlock.bind(this), lineno, source);
    }

    public traceableHasBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<boolean> {
        return this.traceableMethod(this.hasBlock.bind(this), lineno, source);
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

    protected get include(): (context: any, from: TwingSource, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any, withContext: boolean, ignoreMissing: boolean, line: number) => Promise<string> {
        return (context: any, from: TwingSource, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any, withContext: boolean, ignoreMissing: boolean, line: number): Promise<string> => {
            return include(this.env, context, from, templates, variables, withContext, ignoreMissing).catch((e) => {
                if (e instanceof TwingError) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(line);
                    }
                }

                throw e;
            });
        }
    }

    protected get isCountable(): (candidate: any) => boolean {
        return isCountable;
    }

    protected get isIn(): (a: any, b: any) => boolean {
        return isIn;
    }

    protected concatenate(object1: any, object2: any): string {
        if (isNullOrUndefined(object1)) {
            object1 = '';
        }

        if (isNullOrUndefined(object2)) {
            object2 = '';
        }

        return String(object1) + String(object2);
    }

    protected get iterate(): (it: any, cb: IterateCallback) => Promise<void> {
        return iterate;
    }

    protected get merge(): <V>(iterable1: Map<any, V>, iterable2: Map<any, V>) => Map<any, V> {
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
