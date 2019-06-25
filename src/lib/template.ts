/**
 * Default base class for compiled templates.
 *
 * This class is an implementation detail of how template compilation currently
 * works, which might change. It should never be used directly. Use twig.load()
 * instead, which returns an instance of TwingTemplateWrapper.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 *
 * @internal
 */
import {TwingErrorRuntime} from "./error/runtime";
import {TwingSource} from "./source";

import {TwingNodeBlock} from "./node/block";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {TwingTemplateWrapper} from "./template-wrapper";
import {echo, flush, obEndClean, obGetClean, obGetContents, obStart, TwingOutputBuffering} from './output-buffering';
import {iteratorToMap} from "./helpers/iterator-to-map";
import {merge, merge as twingMerge} from "./helpers/merge";
import {TwingExtensionInterface} from "./extension-interface";
import {isCountable} from "./helpers/is-countable";
import {isIn} from "./helpers/is-in";
import {isMap} from "./helpers/is-map";
import {createRange} from "./helpers/create-range";
import {each} from "./helpers/each";
import {isTraversable} from "./helpers/is-traversable";
import {TwingMarkup} from "./markup";
import {count} from "./helpers/count";
import {compare} from "./helpers/compare";
import {examineObject} from "./helpers/examine-object";
import {cloneMap} from "./helpers/clone-map";

const isPlainObject = require('is-plain-object');
const isBool = require('locutus/php/var/is_bool');
const isFloat = require('locutus/php/var/is_float');
const isObject = require('isobject');
const regexParser = require('regex-parser');

export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    protected parent: TwingTemplate | false = null;
    protected parents: Map<TwingTemplate | TwingTemplateWrapper | string, TwingTemplate | TwingTemplateWrapper> = new Map();
    protected env: TwingEnvironment;
    protected blocks: Map<string, Array<any>> = new Map();
    protected traits: Map<string, Array<any>> = new Map();

    /**
     * @internal
     */
    protected extensions: Map<string, TwingExtensionInterface> = new Map();

    constructor(env: TwingEnvironment) {
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
     * Returns debug information about the template.
     *
     * @returns {Map<number, {line: number, column: number}>} Debug information
     *
     * @internal
     */
    abstract getDebugInfo(): Map<number, { line: number, column: number }>;

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
     * @returns TwingTemplate|TwingTemplateWrapper|false The parent template or false if there is no parent
     */
    getParent(context: any = {}) {
        if (this.parent !== null) {
            return this.parent;
        }

        let parent: TwingTemplate | TwingTemplateWrapper | string | false;

        try {
            parent = this.doGetParent(context);

            if (parent === false) {
                return false;
            }

            if (parent instanceof TwingTemplate || parent instanceof TwingTemplateWrapper) {
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
            parent.displayBlock(name, context, twingMerge(this.blocks, blocks) as Map<string, Array<any>>, false);
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
        TwingOutputBuffering.obStart();

        this.displayParentBlock(name, context, blocks);

        return TwingOutputBuffering.obGetClean() as string;
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
        TwingOutputBuffering.obStart();

        this.displayBlock(name, context, blocks, useBlocks);

        return TwingOutputBuffering.obGetClean() as string;
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

    /**
     * Returns all block names in the active context of the template.
     *
     * This method checks blocks defined in the active template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @returns {Array<string>}
     */
    getBlockNames(context: any, blocks: Map<string, Array<any>> = new Map()): Array<string> {
        let names: any = new Set([...blocks.keys(), ...this.blocks.keys()]);

        let parent: TwingTemplate = this.getParent(context) as TwingTemplate;

        if (parent) {
            names = new Set([...names, ...parent.getBlockNames(context)]);
        }

        return [...names];
    }

    public loadTemplate(template: TwingTemplate | TwingTemplateWrapper | Array<TwingTemplate> | string, templateName: string = null, line: number = null, index: number = null): TwingTemplate | TwingTemplateWrapper {
        try {
            if (Array.isArray(template)) {
                return this.env.resolveTemplate(template, this.getSourceContext());
            }

            if (template instanceof TwingTemplate || template instanceof TwingTemplateWrapper) {
                return template;
            }

            return this.env.loadTemplate(template as string, index, this.getSourceContext());
        } catch (e) {
            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    let source = this.getSourceContext();

                    e.setSourceContext(templateName ? new TwingSource(source.getCode(), templateName, source.getPath()) : source);
                }

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

        if (!(context instanceof Map)) {
            context = iteratorToMap(context);
        }

        this.displayWithErrorHandling(this.env.mergeGlobals(context), twingMerge(this.blocks, blocks) as Map<string, Array<any>>);
    }

    render(context: any): string {
        let level = TwingOutputBuffering.obGetLevel();

        TwingOutputBuffering.obStart();

        try {
            this.display(context);
        } catch (e) {
            while (TwingOutputBuffering.obGetLevel() > level) {
                TwingOutputBuffering.obEndClean();
            }

            throw e;
        }

        return TwingOutputBuffering.obGetClean() as string;
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {*} context An array of parameters to pass to the template
     * @param {Map<string, Array<*>>} blocks  An array of blocks to pass to the template
     */
    abstract doDisplay(context: {}, blocks: Map<string, Array<any>>): void;

    protected doGetParent(context: any): TwingTemplate | TwingTemplateWrapper | string | false {
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
        let self = this;

        return function () {
            try {
                return method.apply(self, arguments);
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
        return this.traceableMethod(this.displayBlock, lineno, source);
    };

    public traceableDisplayParentBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.displayParentBlock, lineno, source);
    };

    public traceableRenderBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.renderBlock, lineno, source);
    }

    public traceableRenderParentBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.renderParentBlock, lineno, source);
    }

    public traceableHasBlock(lineno: number, source: TwingSource) {
        return this.traceableMethod(this.hasBlock, lineno, source);
    }

    /**
     * Clone a map.
     *
     * @param {Map<K, V>} map
     * @returns {Map<K, V>}
     */
    protected cloneMap<K, V>(map: Map<K, V>): Map<K, V> {
        return cloneMap(map);
    }

    /**
     * Compare by conforming to PHP loose comparisons rules.
     *
     * @param {*} firstOperand
     * @param {*} secondOperand
     * @return boolean
     */
    protected compare(firstOperand: any, secondOperand: any): boolean {
        return compare(firstOperand, secondOperand);
    }

    /**
     * Count all elements in an object.
     *
     * @param {*} countable
     * @returns {number}
     */
    protected count(countable: any): number {
        return count(countable);
    }

    /**
     * @param {string} string
     * @param {string} charset
     *
     * @return TwingMarkup
     */
    protected createMarkup(string: string, charset: string): TwingMarkup {
        return new TwingMarkup(string, charset);
    }

    /**
     * @param {string} string
     *
     * @return RegExp
     */
    protected createRegex(string: string): RegExp {
        return regexParser(string);
    }

    /**
     * @param {V} low
     * @param {V} high
     * @param {number} step
     *
     * @return Map<number, V>
     */
    protected createRange<V>(low: V, high: V, step: number): Map<number, V> {
        return createRange(low, high, step);
    }

    /**
     * @param {*} value
     *
     * @return string | void
     */
    protected echo(value: any): string | void {
        return echo(value);
    }

    /**
     * Executes the provided function once for each element of an iterable.
     *
     * @param {*} it An iterable
     * @param {Function} cb Function to execute for each element, taking a key and a value as arguments
     * @return void
     */
    protected each(it: any, cb: Function): void {
        return each(it, cb);
    }

    /**
     * @return boolean
     */
    protected endAndCleanOutputBuffer(): boolean {
        return obEndClean();
    }

    /**
     * @param {*} seq
     * @return *
     */
    protected ensureTraversable(seq: any): any {
        if (isTraversable(seq) || isPlainObject(seq)) {
            return seq;
        }

        return [];
    }

    /**
     * @return boolean
     */
    protected flush(): boolean {
        return flush();
    }

    /**
     * @return string | false
     */
    protected getAndCleanOutputBuffer(): string | false {
        return obGetClean();
    }

    /**
     * Returns the attribute value for a given array/object.
     *
     * @param {*} object The object or array from where to get the item
     * @param {*} item The item to get from the array or object
     * @param {Array<*>} _arguments An array of arguments to pass if the item is an object method
     * @param {string} type The type of attribute (@see Twig_Template constants)
     * @param {boolean} isDefinedTest Whether this is only a defined check
     * @param {boolean} ignoreStrictCheck Whether to ignore the strict attribute check or not
     * @param {boolean} sandboxed
     *
     * @return mixed The attribute value, or a boolean when isDefinedTest is true, or null when the attribute is not set and ignoreStrictCheck is true
     *
     * @throw TwingErrorRuntime if the attribute does not exist and Twing is running in strict mode and isDefinedTest is false
     */
    protected getAttribute(object: any, item: any, _arguments: Array<any> = [], type: string = TwingTemplate.ANY_CALL, isDefinedTest: boolean = false, ignoreStrictCheck: boolean = false, sandboxed: boolean = false): any {
        let env = this.env;
        let message: string;

        // ANY_CALL or ARRAY_CALL
        if (type !== TwingTemplate.METHOD_CALL) {
            let arrayItem;

            if (isBool(item)) {
                arrayItem = item ? 1 : 0;
            } else if (isFloat(item)) {
                arrayItem = parseInt(item);
            } else {
                arrayItem = item;
            }

            if (object) {
                if (Array.isArray(object) && (typeof object[arrayItem] !== 'undefined')) {
                    if (isDefinedTest) {
                        return true;
                    }

                    return object[arrayItem];
                } else if (isMap(object) && object.has(arrayItem)) {
                    if (isDefinedTest) {
                        return true;
                    }

                    return object.get(item);
                } else if (typeof object === 'object' && (object.constructor.name === 'Object') && Reflect.has(object, arrayItem) && (typeof Reflect.get(object, arrayItem) !== 'function')) {
                    if (isDefinedTest) {
                        return true;
                    }

                    return Reflect.get(object, item);
                }
            }

            if ((type === TwingTemplate.ARRAY_CALL) || (Array.isArray(object)) || (object instanceof Map) || (object === null) || (typeof object !== 'object')) {
                if (isDefinedTest) {
                    return false;
                }

                if (ignoreStrictCheck || !env.isStrictVariables()) {
                    return;
                }

                if (Array.isArray(object)) {
                    // object is an array
                    if (object.length < 1) {
                        message = `Index "${arrayItem}" is out of bounds as the array is empty.`;
                    } else {
                        message = `Index "${arrayItem}" is out of bounds for array [${object}].`;

                    }
                } else if (isMap(object)) {
                    // object is a map
                    message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                } else if (type === TwingTemplate.ARRAY_CALL) {
                    // object is another kind of object
                    if (object === null) {
                        message = `Impossible to access a key ("${item}") on a null variable.`;
                    } else {
                        message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                    }
                } else if (object === null) {
                    // object is null
                    message = `Impossible to access an attribute ("${item}") on a null variable.`;
                } else {
                    // object is a primitive
                    message = `Impossible to access an attribute ("${item}") on a ${typeof object} variable ("${object}").`;
                }

                throw new TwingErrorRuntime(message);
            }
        }

        // ANY_CALL or METHOD_CALL
        if ((object === null) || (!isObject(object))) {
            // object is a primitive
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            if (object === null) {
                message = `Impossible to invoke a method ("${item}") on a null variable.`;
            } else if (Array.isArray(object)) {
                message = `Impossible to invoke a method ("${item}") on an array.`;
            } else {
                message = `Impossible to invoke a method ("${item}") on a ${typeof object} variable ("${object}").`;
            }

            throw new TwingErrorRuntime(message);
        }

        if (object instanceof TwingTemplate) {
            throw new TwingErrorRuntime('Accessing TwingTemplate attributes is forbidden.');
        }

        // object property
        if (type !== TwingTemplate.METHOD_CALL) {
            if (Reflect.has(object, item) && (typeof object[item] !== 'function')) {
                if (isDefinedTest) {
                    return true;
                }

                if (sandboxed) {
                    env.checkPropertyAllowed(object, item);
                }

                return object[item];
            }
        }

        let cache = new Map();
        let class_ = object.constructor.name;
        let classCache: Map<string, string> = null;

        // object method
        // precedence: getXxx() > isXxx() > hasXxx()
        if (!classCache) {
            let methods: Array<string> = [];

            for (let property of examineObject(object)) {
                let candidate = object[property];

                if (typeof candidate === 'function') {
                    methods.push(property);
                }
            }

            methods.sort();

            let lcMethods: Array<string> = methods.map((method) => {
                return method.toLowerCase();
            });

            classCache = new Map();

            for (let i = 0; i < methods.length; i++) {
                let method: string = methods[i];
                let lcName: string = lcMethods[i];

                classCache.set(method, method);
                classCache.set(lcName, method);

                let name: string;

                if (lcName[0] === 'g' && lcName.indexOf('get') === 0) {
                    name = method.substr(3);
                    lcName = lcName.substr(3);
                } else if (lcName[0] === 'i' && lcName.indexOf('is') === 0) {
                    name = method.substr(2);
                    lcName = lcName.substr(2);
                } else if (lcName[0] === 'h' && lcName.indexOf('has') === 0) {
                    name = method.substr(3);
                    lcName = lcName.substr(3);

                    if (lcMethods.includes('is' + lcName)) {
                        continue;
                    }
                } else {
                    continue;
                }

                // skip get() and is() methods (in which case, name is empty)
                if (name) {
                    if (!classCache.has(name)) {
                        classCache.set(name, method);
                    }

                    if (!classCache.has(lcName)) {
                        classCache.set(lcName, method);
                    }
                }
            }

            if (class_ !== 'Object') {
                cache.set(class_, classCache);
            }
        }

        let itemAsString: string = item as string;
        let method: string = null;
        let lcItem: string;

        if (classCache.has(item)) {
            method = classCache.get(item);
        } else if (classCache.has(lcItem = itemAsString.toLowerCase())) {
            method = classCache.get(lcItem);
        } else {
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            throw new TwingErrorRuntime(`Neither the property "${item}" nor one of the methods ${item}()" or "get${item}()"/"is${item}()"/"has${item}()" exist and have public access in class "${object.constructor.name}".`);
        }

        if (isDefinedTest) {
            return true;
        }

        if (sandboxed) {
            env.checkMethodAllowed(object, method);
        }

        return Reflect.get(object, method).apply(object, _arguments);
    }

    /**
     * @param {string} constant
     * @param {*} object
     *
     * @return *
     */
    protected getConstant(constant: string, object: any): any {
        return null; //twingFunctionConstant(this.env, constant, object);
    }

    /**
     * @return string | false
     */
    protected getOutputBufferContent(): string | false {
        return obGetContents();
    }

    /**
     * @param {*} thing
     * @return boolean
     */
    protected isCountable(thing: any): boolean {
        return isCountable(thing);
    }

    /**
     * @param {*} value
     * @param {*} compare
     * @return boolean
     */
    protected isIn(value: any, compare: any): boolean {
        return isIn(value, compare);
    }

    /**
     * @param {*} candidate
     * @return boolean
     */
    protected isMap(candidate: any): boolean {
        return isMap(candidate);
    }

    /**
     * @param {*} candidate
     * @return boolean
     */
    protected isPlainObject(candidate: any): boolean {
        return isPlainObject(candidate);
    }

    /**
     * Converts input to Map.
     *
     * @param {*} iterator
     * @return {Map<any, any>}
     */
    protected iteratorToMap(iterator: any): Map<any, any> {
        return iteratorToMap(iterator);
    }

    /**
     * @param {Array<V> | Map<K, V>} iterable1
     * @param {Array<V> | Map<K, V>} iterable2
     *
     * @return Array<V> | Map<K, V>
     */
    protected merge<K, V>(iterable1: Array<V> | Map<K, V>, iterable2: Array<V> | Map<K, V>): Array<V> | Map<K, V> {
        return merge(iterable1, iterable2);
    }

    /**
     * @return boolean
     */
    protected startOutputBuffering(): boolean {
        return obStart();
    }

    /**
     * @param {string} message
     * @param {number} lineno
     * @param {string} source
     * @return void
     */
    protected throwRuntimeError(message: string, lineno: number, source: string): void {
        throw(new TwingErrorRuntime(message, lineno, source));
    }
}
