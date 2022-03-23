import {TwingErrorRuntime} from "./error/runtime";
import {TwingSource} from "./source";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {TwingOutputBuffer} from './output-buffer';
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
import {evaluate} from "./helpers/evaluate";

type TwingTemplateMacrosMap = Map<string, TwingTemplateMacroHandler>;
type TwingTemplateAliasesMap = TwingContext<string, TwingTemplate>;
type TwingTemplateTraceableMethod<T> = (...args: Array<any>) => Promise<T>;

export type TwingTemplateBlocksMap = Map<string, [TwingTemplate, string]>;
export type TwingTemplateBlockHandler = (context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap) => Promise<void>;
export type TwingTemplateMacroHandler = (outputBuffer: TwingOutputBuffer, ...args: Array<any>) => Promise<string>;

/**
 * Default base class for compiled templates.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    private readonly _environment: TwingEnvironment;
    private _source: TwingSource;

    protected parent: TwingTemplate | false;
    protected parents: Map<TwingTemplate | string, TwingTemplate>;
    protected blocks: TwingTemplateBlocksMap;
    protected blockHandlers: Map<string, TwingTemplateBlockHandler>;
    protected macroHandlers: Map<string, TwingTemplateMacroHandler>;
    protected traits: TwingTemplateBlocksMap;
    protected macros: TwingTemplateMacrosMap;
    protected aliases: TwingTemplateAliasesMap;

    constructor(environment: TwingEnvironment) {
        this._environment = environment;

        this.parents = new Map();
        this.aliases = new TwingContext();
        this.blockHandlers = new Map();
        this.macroHandlers = new Map();
    }

    get environment(): TwingEnvironment {
        return this._environment;
    }

    /**
     * @returns {TwingSource}
     */
    get source(): TwingSource {
        return this._source;
    }

    /**
     * Returns the template name.
     *
     * @returns {string} The template name
     */
    get templateName(): string {
        return this.source.getName();
    }

    get isTraitable(): boolean {
        return true;
    }

    /**
     * Returns the parent template.
     *
     * @param {any} context
     *
     * @returns {Promise<TwingTemplate|false>} The parent template or false if there is no parent
     */
    public getParent(context: any = {}): Promise<TwingTemplate | false> {
        if (this.parent) {
            return Promise.resolve(this.parent);
        }

        return this.doGetParent(context)
            .then((parent) => {
                if (parent === false || parent instanceof TwingTemplate) {
                    if (parent instanceof TwingTemplate) {
                        this.parents.set(parent.source.getName(), parent);
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
    public getBlocks(): Promise<TwingTemplateBlocksMap> {
        if (this.blocks) {
            return Promise.resolve(this.blocks);
        } else {
            return this.getTraits().then((traits) => {
                this.blocks = merge(traits, new Map([...this.blockHandlers.keys()].map((key) => [key, [this, key]])));

                return this.blocks;
            });
        }
    }

    /**
     * Displays a block.
     *
     * @param {string} name The block name to display
     * @param {any} context The context
     * @param {TwingOutputBuffer} outputBuffer
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @returns {Promise<void>}
     */
    protected displayBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap, useBlocks: boolean): Promise<void> {
        return this.getBlocks().then((ownBlocks) => {
            let blockHandler: TwingTemplateBlockHandler;

            if (useBlocks && blocks.has(name)) {
                blockHandler = blocks.get(name)[0].blockHandlers.get(blocks.get(name)[1]);
            } else if (ownBlocks.has(name)) {
                blockHandler = ownBlocks.get(name)[0].blockHandlers.get(ownBlocks.get(name)[1]);
            }

            if (blockHandler) {
                return blockHandler(context, outputBuffer, blocks);
            } else {
                return this.getParent(context).then((parent) => {
                    if (parent) {
                        return parent.displayBlock(name, context, outputBuffer, merge(ownBlocks, blocks), false);
                    } else if (blocks.has(name)) {
                        throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].templateName}" as the block does not exist in the parent template "${this.templateName}".`, -1, blocks.get(name)[0].source);
                    } else {
                        throw new TwingErrorRuntime(`Block "${name}" on template "${this.templateName}" does not exist.`, -1, this.source);
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
     * @param {TwingOutputBuffer} outputBuffer
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     *
     * @returns {Promise<void>}
     */
    protected displayParentBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap): Promise<void> {
        return this.getTraits().then((traits) => {
            if (traits.has(name)) {
                return traits.get(name)[0].displayBlock(traits.get(name)[1], context, outputBuffer, blocks, false);
            } else {
                return this.getParent(context).then((template) => {
                    if (template !== false) {
                        return template.displayBlock(name, context, outputBuffer, blocks, false);
                    } else {
                        throw new TwingErrorRuntime(`The template has no parent and no traits defining the "${name}" block.`, -1, this.source);
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
     * @param {TwingOutputBuffer} outputBuffer
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     *
     * @returns {Promise<string>} The rendered block
     */
    protected renderParentBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap): Promise<string> {
        outputBuffer.start();

        return this.getBlocks().then((blocks) => {
            return this.displayParentBlock(name, context, outputBuffer, blocks).then(() => {
                return outputBuffer.getAndClean() as string;
            })
        });
    }

    /**
     * Renders a block.
     *
     * @param {string} name The block name to display
     * @param {any} context The context
     * @param {TwingOutputBuffer} outputBuffer
     * @param {TwingTemplateBlocksMap} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @return {Promise<string>} The rendered block
     */
    protected renderBlock(name: string, context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap = new Map(), useBlocks = true): Promise<string> {
        outputBuffer.start();

        return this.displayBlock(name, context, outputBuffer, blocks, useBlocks).then(() => {
            return outputBuffer.getAndClean() as string;
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
    public hasBlock(name: string, context: any, blocks: TwingTemplateBlocksMap = new Map()): Promise<boolean> {
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
     * @param {string} name The name of the macro
     *
     * @return {Promise<boolean>}
     */
    public hasMacro(name: string): Promise<boolean> {
        // @see https://github.com/twigphp/Twig/issues/3174 as to why we don't check macro existence in parents
        return Promise.resolve(this.macroHandlers.has(name));
    }

    /**
     * @param name The name of the macro
     */
    public getMacro(name: string): Promise<TwingTemplateMacroHandler> {
       return this.hasMacro(name).then((hasMacro) => {
           if (hasMacro) {
               return this.macroHandlers.get(name);
           }
           else {
               return null;
           }
       })
    }

    public loadTemplate(templates: TwingTemplate | Map<number, TwingTemplate> | string, line: number = null, index: number = 0): Promise<TwingTemplate> {
        let promise: Promise<TwingTemplate>;

        if (typeof templates === 'string') {
            promise = this.environment.loadTemplate(templates, index, this.source);
        } else if (templates instanceof TwingTemplate) {
            promise = Promise.resolve(templates);
        } else {
            promise = this.environment.resolveTemplate([...templates.values()], this.source);
        }

        return promise.catch((e: TwingError) => {
            if (e.getTemplateLine() !== -1) {
                throw e;
            }

            if (line) {
                e.setTemplateLine(line);
            }

            throw e;
        });
    }

    /**
     * Returns template traits.
     *
     * @returns {Promise<TwingTemplateBlocksMap>} A map of traits
     */
    public getTraits(): Promise<TwingTemplateBlocksMap> {
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

    public display(context: any, blocks: TwingTemplateBlocksMap = new Map(), outputBuffer?: TwingOutputBuffer): Promise<void> {
        if (!outputBuffer) {
            outputBuffer = new TwingOutputBuffer();
        }

        if (context === null) {
            throw new TypeError('Argument 1 passed to TwingTemplate::display() must be an iterator, null given');
        }

        if (!isMap(context)) {
            context = iteratorToMap(context);
        }

        context = new TwingContext(this.environment.mergeGlobals(context));

        return this.getBlocks().then((ownBlocks) => this.displayWithErrorHandling(context, outputBuffer, merge(ownBlocks, blocks)));
    }

    protected displayWithErrorHandling(context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap = new Map()): Promise<void> {
        return this.doDisplay(context, outputBuffer, blocks).catch((e) => {
            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(this.source);
                }
            } else {
                e = new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.source, e);
            }

            throw e;
        });
    }

    public render(context: any, outputBuffer?: TwingOutputBuffer): Promise<string> {
        if (!outputBuffer) {
            outputBuffer = new TwingOutputBuffer();
        }

        let level = outputBuffer.getLevel();

        outputBuffer.start();

        return this.display(context, undefined, outputBuffer)
            .then(() => {
                return outputBuffer.getAndClean() as string;
            })
            .catch((e) => {
                while (outputBuffer.getLevel() > level) {
                    outputBuffer.endAndClean();
                }

                throw e;
            })
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {any} context An array of parameters to pass to the template
     * @param {TwingOutputBuffer} outputBuffer
     * @param {TwingTemplateBlocksMap} blocks
     */
    protected abstract doDisplay(context: any, outputBuffer: TwingOutputBuffer, blocks: TwingTemplateBlocksMap): Promise<void>;

    protected doGetParent(context: any): Promise<TwingTemplate | string | false> {
        return Promise.resolve(false);
    }

    protected callMacro(template: TwingTemplate, name: string, outputBuffer: TwingOutputBuffer, args: any[], lineno: number, context: TwingContext<any, any>, source: TwingSource): Promise<string> {
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
                return handler(outputBuffer, ...args);
            } else {
                throw new TwingErrorRuntime(`Macro "${name}" is not defined in template "${template.templateName}".`, lineno, source);
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

    public traceableRenderBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<string> {
        return this.traceableMethod(this.renderBlock.bind(this), lineno, source);
    }

    public traceableRenderParentBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<string> {
        return this.traceableMethod(this.renderParentBlock.bind(this), lineno, source);
    }

    public traceableHasBlock(lineno: number, source: TwingSource): TwingTemplateTraceableMethod<boolean> {
        return this.traceableMethod(this.hasBlock.bind(this), lineno, source);
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

    protected get cloneMap(): <K, V>(m: Map<K, V>) => Map<K, V> {
        return cloneMap;
    }

    protected get compare(): (a: any, b: any) => boolean {
        return compare;
    }

    protected get constant(): (name: string, object: any) => any {
        return (name: string, object: any) => {
            return constant(this, name, object);
        }
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

    protected get ensureTraversable(): <T>(candidate: T[]) => T[] | [] {
        return ensureTraversable;
    }

    protected get get(): (object: any, property: any) => any {
        return (object, property) => {
            if (isMap(object) || isPlainObject(object)) {
                return get(object, property);
            }
        };
    }

    protected get getAttribute(): (env: TwingEnvironment, object: any, item: any, _arguments: Map<any, any>, type: string, isDefinedTest: boolean, ignoreStrictCheck: boolean, sandboxed: boolean) => any {
        return getAttribute;
    }

    protected get include(): (context: any, outputBuffer: TwingOutputBuffer, templates: string | Map<number, string | TwingTemplate> | TwingTemplate, variables: any, withContext: boolean, ignoreMissing: boolean, line: number) => Promise<string> {
        return (context, outputBuffer, templates, variables, withContext, ignoreMissing, line) => {
            return include(this, context, outputBuffer, templates, variables, withContext, ignoreMissing).catch((e: TwingError) => {
                if (e.getTemplateLine() === -1) {
                    e.setTemplateLine(line);
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

    protected get iterate(): (it: any, cb: IterateCallback) => Promise<void> {
        return iterate;
    }

    protected get merge(): <V>(iterable1: Map<any, V>, iterable2: Map<any, V>) => Map<any, V> {
        return merge;
    }

    protected get parseRegExp(): (input: string) => RegExp {
        return parseRegex;
    }

    protected get evaluate(): (a: any) => boolean {
        return evaluate;
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
