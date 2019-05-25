import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingExtensionSet} from "./extension-set";
import {TwingExtensionCore} from "./extension/core";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingFilter} from "./filter";
import {TwingLexer} from "./lexer";
import {TwingParser} from "./parser";
import {TwingTokenStream} from "./token-stream";
import {TwingSource} from "./source";
import {TwingLoaderInterface} from "./loader-interface";
import {TwingErrorLoader} from "./error/loader";
import {TwingTest} from "./test";
import {TwingFunction} from "./function";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingTemplate} from "./template";
import {TwingError} from "./error";
import {TwingTemplateWrapper} from "./template-wrapper";
import {TwingCacheInterface} from "./cache-interface";
import {TwingLoaderArray} from "./loader/array";
import {TwingLoaderChain} from "./loader/chain";
import {TwingExtensionOptimizer} from "./extension/optimizer";
import {TwingCompiler} from "./compiler";
import {TwingNode, TwingNodeType} from "./node";
import {TwingNodeModule} from "./node/module";
import {TwingCacheNull} from "./cache/null";
import {TwingErrorRuntime} from "./error/runtime";
import {TwingRuntimeLoaderInterface} from "./runtime-loader-interface";
import {merge} from "./helper/merge";
import {join} from "./helper/join";
import {TwingOperator} from "./extension";
import {EventEmitter} from 'events';
import {TwingOutputBuffering} from "./output-buffering";
import {TwingSourceMapNode, TwingSourceMapNodeConstructor} from "./source-map/node";
import {TwingSandboxSecurityPolicyInterface} from "./sandbox/security-policy-interface";
import {TwingSandboxSecurityPolicy} from "./sandbox/security-policy";

const path = require('path');
const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

/**
 *  * Available options:
 *
 *  * debug: When set to true, it automatically set "auto_reload" to true as
 *           well (default to false).
 *
 *  * charset: The charset used by the templates (default to UTF-8).
 *
 *  * base_template_class: The base template class to use for generated
 *                         templates (default to Twig_Template).
 *
 *  * cache: An absolute path where to store the compiled templates,
 *           a TwingCacheInterface implementation,
 *           or false to disable compilation cache (default).
 *
 *  * auto_reload: Whether to reload the template if the original source changed.
 *                 If you don't provide the auto_reload option, it will be
 *                 determined automatically based on the debug value.
 *
 *  * strict_variables: Whether to ignore invalid variables in templates
 *                      (default to false).
 *
 *  * autoescape: Whether to enable auto-escaping (default to html):
 *                  * false: disable auto-escaping
 *                  * html, js: set the autoescaping to one of the supported strategies
 *                  * name: set the autoescaping strategy based on the template name extension
 *                  * callback: a callback that returns an escaping strategy based on the template "name"
 *
 *  * optimizations: A flag that indicates which optimizations to apply
 *                   (default to -1 which means that all optimizations are enabled;
 *                   set it to 0 to disable).
 */
export type TwingEnvironmentOptions = {
    debug?: boolean;
    charset?: string;
    base_template_class?: string;
    cache?: TwingCacheInterface | false | string;
    auto_reload?: boolean;
    strict_variables?: boolean;
    autoescape?: string | boolean | Function;
    optimizations?: number;
    source_map?: boolean | string;
    sandbox_policy?: TwingSandboxSecurityPolicyInterface;
    sandboxed?: boolean
}

export const VERSION = '__VERSION__';

/**
 * Stores the Twing configuration.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export abstract class TwingEnvironment extends EventEmitter {
    private charset: string;
    private loader: TwingLoaderInterface = null;
    private debug: boolean;
    private autoReload: boolean;
    private cache: TwingCacheInterface;
    private lexer: TwingLexer;
    private parser: TwingParser;
    private globals: Map<any, any> = new Map();
    private resolvedGlobals: any;
    private loadedTemplates: Map<string, TwingTemplate> = new Map();
    private strictVariables: boolean;
    private originalCache: TwingCacheInterface | string | false;
    private extensionSet: TwingExtensionSet = null;
    private runtimeLoaders: Array<TwingRuntimeLoaderInterface> = [];
    private runtimes: Map<string, any> = new Map();
    private optionsHash: string;
    private loading: Map<string, string> = new Map();
    private sourceMapNode: TwingSourceMapNode;
    private sourceMap: boolean | string;
    private templateConstructor: Function;
    private autoescape: string | boolean | Function;
    private coreExtension: TwingExtensionCore;
    private sandboxedGlobally: boolean;
    private sandboxed: boolean;
    private sandboxPolicy: TwingSandboxSecurityPolicyInterface;

    /**
     * Constructor.
     *
     * @param {TwingLoaderInterface} loader
     * @param {TwingEnvironmentOptions} options
     */
    constructor(loader: TwingLoaderInterface, options: TwingEnvironmentOptions = null) {
        super();

        this.setLoader(loader);

        options = Object.assign({}, {
            debug: false,
            charset: 'UTF-8',
            strict_variables: false,
            autoescape: 'html',
            cache: false,
            auto_reload: null,
            optimizations: -1,
            source_map: false,
            sandbox_policy: new TwingSandboxSecurityPolicy([], [], new Map(), new Map(), []),
            sandboxed: false
        }, options);

        this.debug = options.debug;
        this.setCharset(options.charset);
        this.autoReload = options.auto_reload === null ? this.debug : options.auto_reload;
        this.strictVariables = options.strict_variables;
        this.setCache(options.cache);
        this.extensionSet = new TwingExtensionSet();
        this.sourceMap = options.source_map;
        this.autoescape = options.autoescape;
        this.sandboxed = false;
        this.sandboxedGlobally = options.sandboxed;
        this.sandboxPolicy = options.sandbox_policy;

        this.setCoreExtension(new TwingExtensionCore(options.autoescape));
        this.addExtension(new TwingExtensionOptimizer(options.optimizations), 'TwingExtensionOptimizer');

        this.setTemplateConstructor(TwingTemplate);
    }

    getCoreExtension(): TwingExtensionCore {
        return this.coreExtension;
    }

    setCoreExtension(extension: TwingExtensionCore) {
        this.addExtension(extension, 'TwingExtensionCore');

        this.coreExtension = extension;
    }

    /**
     * Enables debugging mode.
     */
    enableDebug() {
        this.debug = true;
        this.updateOptionsHash();
    }

    /**
     * Disables debugging mode.
     */
    disableDebug() {
        this.debug = false;
        this.updateOptionsHash();
    }

    /**
     * Checks if debug mode is enabled.
     *
     * @returns {boolean} true if debug mode is enabled, false otherwise
     */
    isDebug() {
        return this.debug;
    }

    /**
     * Enables the auto_reload option.
     */
    enableAutoReload() {
        this.autoReload = true;
    }

    /**
     * Disables the auto_reload option.
     */
    disableAutoReload() {
        this.autoReload = false;
    }

    /**
     * Checks if the auto_reload option is enabled.
     *
     * @returns {boolean} true if auto_reload is enabled, false otherwise
     */
    isAutoReload() {
        return this.autoReload;
    }

    /**
     * Enables the strict_variables option.
     */
    enableStrictVariables() {
        this.strictVariables = true;
        this.updateOptionsHash();
    }

    /**
     * Disables the strict_variables option.
     */
    disableStrictVariables() {
        this.strictVariables = false;
        this.updateOptionsHash();
    }

    /**
     * Checks if the strict_variables option is enabled.
     *
     * @returns {boolean} true if strict_variables is enabled, false otherwise
     */
    isStrictVariables() {
        return this.strictVariables;
    }

    /**
     * Gets the active cache implementation.
     *
     * @param {boolean} original Whether to return the original cache option or the real cache instance
     *
     * @returns {TwingCacheInterface|string|false} A TwingCacheInterface implementation,
     *                                                an absolute path to the compiled templates,
     *                                                or false to disable cache
     */
    getCache(original: boolean = true): TwingCacheInterface | string | false {
        return original ? this.originalCache : this.cache;
    }

    /**
     * Sets the active cache implementation.
     *
     * @param {TwingCacheInterface|string|false} cache A TwingCacheInterface implementation, a string or false to disable cache
     */
    setCache(cache: TwingCacheInterface | string | false) {
        if (typeof cache === 'string') {
            this.originalCache = cache;
            this.cache = this.cacheFromString(cache);
        } else if (cache === false) {
            this.originalCache = cache;
            this.cache = new TwingCacheNull();
        } else if (cache.TwingCacheInterfaceImpl) {
            this.originalCache = this.cache = cache;
        } else {
            throw new Error(`Cache can only be a string, false or a TwingCacheInterface implementation.`);
        }
    }

    abstract cacheFromString(cache: string): TwingCacheInterface;

    setTemplateConstructor(ctor: Function): void {
        this.templateConstructor = ctor;
    }

    getTemplateConstructor(): Function {
        return this.templateConstructor;
    }

    /**
     * Gets the main template key.
     *
     * @return string The template key
     */
    getMainTemplateKey(): string {
        return 'main';
    }

    /**
     * Gets the embedded template key associated with the given index.
     *
     * @param {number|null} index The embededd template index
     *
     * @return string The template key
     */
    getEmbeddedTemplateKey(index: number) {
        return 'embed_' + index;
    }

    /**
     * Gets the template hash associated with the given string.
     *
     * The generated template hash is based on the following parameters:
     *
     *  * The cache key for the given template;
     *  * The currently enabled extensions;
     *  * Twing version;
     *  * Options with what environment was created.
     *
     * @param {string} name The name for which to calculate the template hash
     * @param {number|null} index The index if it is an embedded template
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @return string The template hash
     */
    getTemplateHash(name: string, index: number = null, from: TwingSource = null) {
        let key = this.getLoader().getCacheKey(name, from) + this.optionsHash;

        return hex.stringify(sha256(key)) + (index === null ? '' : '_' + index);
    }

    /**
     * Checks if the source_map option is enabled.
     *
     * @returns {boolean} true if source_map is enabled, false otherwise
     */
    isSourceMap() {
        return this.sourceMap;
    }

    /**
     * Renders a template.
     *
     * @param {string} name The template name
     * @param {{}} context An array of parameters to pass to the template
     * @returns {Promise<string>}
     */
    render(name: string, context: any = {}): string {
        return this.loadTemplate(name).render(context);
    }

    /**
     * Displays a template.
     *
     * @param {string} name The template name
     * @param {{}} context An array of parameters to pass to the template
     *
     * @throws TwingErrorLoader  When the template cannot be found
     * @throws TwingErrorSyntax  When an error occurred during compilation
     * @throws TwingErrorRuntime When an error occurred during rendering
     */
    display(name: string, context: any = {}) {
        this.loadTemplate(name).display(context);
    }

    /**
     * Loads a template.
     *
     * @param {string | TwingTemplateWrapper | TwingTemplate} name The template name
     *
     * @throws {TwingErrorLoader}  When the template cannot be found
     * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
     * @throws {TwingErrorSyntax}  When an error occurred during compilation
     *
     * @returns {TwingTemplateWrapper}
     */
    load(name: string | TwingTemplateWrapper | TwingTemplate) {
        if (name instanceof TwingTemplateWrapper) {
            return name;
        }

        if (name instanceof TwingTemplate) {
            return new TwingTemplateWrapper(this, name);
        }

        return new TwingTemplateWrapper(this, this.loadTemplate(name as string));
    }

    /**
     * Loads a template internal representation.
     *
     * @param {string} name  The template name
     * @param {number} index The index if it is an embedded template
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @returns {TwingTemplate} A template instance representing the given template name
     *
     * @throws {TwingErrorLoader}  When the template cannot be found
     * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
     * @throws {TwingErrorSyntax}  When an error occurred during compilation
     *
     * @internal
     */
    loadTemplate(name: string, index: number = null, from: TwingSource = null): TwingTemplate {
        this.emit('template', name, from);

        let templateConstructor = this.getTemplateConstructor();
        let templateKey = index === null ? this.getMainTemplateKey() : this.getEmbeddedTemplateKey(index);

        let templateHash: string;
        let mainTemplateHash: string = this.getTemplateHash(name, null, from);

        if (index !== null) {
            templateHash = this.getTemplateHash(name, index, from);
        } else {
            templateHash = mainTemplateHash;
        }

        let loadedTemplatesKey = mainTemplateHash + templateKey;

        if (this.loadedTemplates.has(loadedTemplatesKey)) {
            return this.loadedTemplates.get(loadedTemplatesKey);
        }

        let cache = this.cache as TwingCacheInterface;
        let key = cache.generateKey(name, mainTemplateHash);

        let templates: { [s: string]: new(e: TwingEnvironment) => TwingTemplate } = {};

        if (!this.isAutoReload() || this.isTemplateFresh(name, cache.getTimestamp(key), from)) {
            templates = cache.load(key)(templateConstructor);
        }

        if (!templates[templateKey]) {
            let source = this.getLoader().getSourceContext(name, from);
            let content = this.compileSource(source);

            cache.write(key, content);

            templates = cache.load(key)(templateConstructor);

            if (!templates[templateKey]) {
                templates = new Function(`let module = {
    exports: undefined
};

${content}

return module.exports;

`)()(templateConstructor);

                if (!templates[templateKey]) {
                    throw new TwingErrorRuntime(`Failed to load Twig template "${name}", index "${index}": cache is corrupted.`, -1, source);
                }
            }
        }

        // to be removed in 3.0
        this.extensionSet.initRuntime(this);

        if (this.loading.has(templateHash)) {
            throw new TwingErrorRuntime(`Circular reference detected for Twig template "${name}", path: ${join(merge(this.loading, new Map([[0, name]])) as Map<any, string>, ' -> ')}.`);
        }

        let mainTemplate: TwingTemplate;

        this.loading.set(templateHash, name);

        try {
            for (let key in templates) {
                let Tpl = templates[key];
                let template = new Tpl(this);

                if (key === this.getMainTemplateKey()) {
                    mainTemplate = template;
                }

                this.loadedTemplates.set(mainTemplateHash + key, template);
            }
        } finally {
            this.loading.delete(templateHash);
        }

        return mainTemplate;
    }

    /**
     * Creates a template from source.
     *
     * This method should not be used as a generic way to load templates.
     *
     * @param {string} template The template name
     *
     * @returns {TwingTemplate} A template instance representing the given template name
     *
     * @throws TwingErrorLoader When the template cannot be found
     * @throws TwingErrorSyntax When an error occurred during compilation
     */
    createTemplate(template: string) {
        let result: TwingTemplate;
        let name = `__string_template__${hex.stringify(sha256(template))}`;
        let current = this.getLoader();

        let loader = new TwingLoaderChain([
            new TwingLoaderArray(new Map([[name, template]])),
            current,
        ]);

        this.setLoader(loader);

        try {
            result = this.loadTemplate(name);
        } finally {
            this.setLoader(current);
        }

        return result;
    }

    /**
     * Returns true if the template is still fresh.
     *
     * @param {string} name The template name
     * @param {number} time The last modification time of the cached template
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @returns {boolean} true if the template is fresh, false otherwise
     */
    isTemplateFresh(name: string, time: number, from: TwingSource) {
        return this.getLoader().isFresh(name, time, from);
    }

    /**
     * Tries to load a template consecutively from an array.
     *
     * Similar to loadTemplate() but it also accepts instances of TwingTemplate and
     * TwingTemplateWrapper, and an array of templates where each is tried to be loaded.
     *
     * @param {string|TwingTemplate|TwingTemplateWrapper|Array<string|TwingTemplate>} names A template or an array of templates to try consecutively
     *
     * @returns {TwingTemplate|TwingTemplateWrapper}
     *
     * @throws {TwingErrorLoader} When none of the templates can be found
     * @throws {TwingErrorSyntax} When an error occurred during compilation
     */
    resolveTemplate(names: string | TwingTemplate | TwingTemplateWrapper | Array<string | TwingTemplate>, source: TwingSource = null): TwingTemplate | TwingTemplateWrapper {
        let self = this;
        let namesArray: Array<any>;

        if (!Array.isArray(names)) {
            namesArray = [names];
        } else {
            namesArray = names;
        }

        let error = null;

        for (let name of namesArray) {
            if (name instanceof TwingTemplate) {
                return name;
            }

            if (name instanceof TwingTemplateWrapper) {
                return name;
            }

            try {
                return self.loadTemplate(name, null, source);
            } catch (e) {
                if (e instanceof TwingErrorLoader) {
                    error = e;
                } else {
                    throw e;
                }
            }
        }

        if (namesArray.length === 1) {
            throw error;
        }

        throw new TwingErrorLoader(`Unable to find one of the following templates: "${namesArray.join(', ')}".`);
    }

    setLexer(lexer: TwingLexer) {
        this.lexer = lexer;
    }

    /**
     * Tokenizes a source code.
     *
     * @param {TwingSource} source The source to tokenize
     * @returns {TwingTokenStream}
     *
     * @throws {TwingErrorSyntax} When the code is syntactically wrong
     */
    tokenize(source: TwingSource) {
        if (!this.lexer) {
            this.lexer = new TwingLexer(this);
        }

        return this.lexer.tokenize(source);
    }

    setParser(parser: TwingParser) {
        this.parser = parser;
    }

    /**
     * Converts a token stream to a template.
     *
     * @param {TwingTokenStream} stream
     * @returns {TwingNodeModule}
     *
     * @throws {TwingErrorSyntax} When the token stream is syntactically or semantically wrong
     */
    parse(stream: TwingTokenStream): TwingNodeModule {
        if (!this.parser) {
            this.parser = new TwingParser(this);
        }

        return this.parser.parse(stream);
    }

    /**
     * Compiles a node and returns its compiled templates.
     *
     * @returns { Map<number, TwingTemplate> } The compiled templates
     */
    compile(node: TwingNode): string {
        let compiler = new TwingCompiler(this);

        return compiler.compile(node).getSource();
    }

    /**
     *
     * @param {TwingSource} source
     * @returns {Map<number, TwingTemplate> }
     */
    compileSource(source: TwingSource): string {
        try {
            return this.compile(this.parse(this.tokenize(source)));
        } catch (e) {
            if (e instanceof TwingError) {
                throw e;
            } else {
                throw new TwingErrorSyntax(`An exception has been thrown during the compilation of a template ("${e.message}").`, -1, source);
            }
        }
    }

    setLoader(loader: TwingLoaderInterface) {
        this.loader = loader;
    }

    /**
     * Gets the Loader instance.
     *
     * @return TwingLoaderInterface
     */
    getLoader() {
        return this.loader;
    }

    /**
     * Sets the default template charset.
     *
     * @param {string} charset The default charset
     */
    setCharset(charset: string) {
        this.charset = charset;
    }

    /**
     * Gets the default template charset.
     *
     * @return {string} The default charset
     */
    getCharset() {
        return this.charset;
    }

    /**
     * Returns true if the given extension is registered.
     *
     * @param {string} name
     * @returns {boolean}
     */
    hasExtension(name: string) {
        return this.extensionSet.hasExtension(name);
    }

    /**
     * Adds a runtime loader.
     */
    addRuntimeLoader(loader: TwingRuntimeLoaderInterface) {
        this.runtimeLoaders.push(loader);
    }

    /**
     * Gets an extension by name.
     *
     * @param {string} name
     * @returns {TwingExtensionInterface}
     */
    getExtension(name: string) {
        return this.extensionSet.getExtension(name);
    }

    /**
     * Returns the runtime implementation of a Twig element (filter/function/test).
     *
     * @param {string} class_ A runtime class name
     *
     * @returns {{}} The runtime implementation
     *
     * @throws TwingErrorRuntime When the runtime cannot be found
     */
    getRuntime(class_: string): any {
        if (this.runtimes.has(class_)) {
            return this.runtimes.get(class_);
        }

        for (let loader of this.runtimeLoaders) {
            let runtime = loader.load(class_);

            if (runtime !== null) {
                this.runtimes.set(class_, runtime);

                return runtime;
            }
        }

        throw new TwingErrorRuntime(`Unable to load the "${class_}" runtime.`);
    }

    /**
     *
     * @param {TwingExtensionInterface} extension
     * @param {string} name
     */
    addExtension(extension: TwingExtensionInterface, name: string = null) {
        this.extensionSet.addExtension(extension, name);
        this.updateOptionsHash();
    }

    /**
     * Registers an array of extensions.
     *
     * @param {Array<TwingExtensionInterface>} extensions An array of extensions
     */
    setExtensions(extensions: Array<TwingExtensionInterface>) {
        this.extensionSet.setExtensions(extensions);
        this.updateOptionsHash();
    }

    /**
     * Returns all registered extensions.
     *
     * @returns Map<string, TwingExtensionInterface> A hash of extensions (keys are for internal usage only and should not be relied on)
     */
    getExtensions() {
        return this.extensionSet.getExtensions();
    }

    addTokenParser(parser: TwingTokenParserInterface) {
        this.extensionSet.addTokenParser(parser);
    }

    /**
     * Gets the registered Token Parsers.
     *
     * @returns {Array<TwingTokenParserInterface>}
     *
     * @internal
     */
    getTokenParsers() {
        return this.extensionSet.getTokenParsers();
    }

    /**
     * Gets registered tags.
     *
     * @return Map<string, TwingTokenParserInterface>
     *
     * @internal
     */
    getTags(): Map<string, TwingTokenParserInterface> {
        let tags = new Map();

        this.getTokenParsers().forEach(function (parser) {
            tags.set(parser.getTag(), parser);
        });

        return tags;
    }

    addNodeVisitor(visitor: TwingNodeVisitorInterface) {
        this.extensionSet.addNodeVisitor(visitor);
    }

    /**
     * Gets the registered Node Visitors.
     *
     * @returns {Array<TwingNodeVisitorInterface>}
     *
     * @internal
     */
    getNodeVisitors() {
        return this.extensionSet.getNodeVisitors();
    }

    addFilter(filter: TwingFilter) {
        this.extensionSet.addFilter(filter);
    }

    /**
     * Get a filter by name.
     *
     * Subclasses may override this method and load filters differently;
     * so no list of filters is available.
     *
     * @param string name The filter name
     *
     * @return Twig_Filter|false A Twig_Filter instance or null if the filter does not exist
     *
     * @internal
     */
    getFilter(name: string): TwingFilter {
        return this.extensionSet.getFilter(name);
    }

    registerUndefinedFilterCallback(callable: Function) {
        this.extensionSet.registerUndefinedFilterCallback(callable);
    }

    /**
     * Gets the registered Filters.
     *
     * Be warned that this method cannot return filters defined with registerUndefinedFilterCallback.
     *
     * @return Twig_Filter[]
     *
     * @see registerUndefinedFilterCallback
     *
     * @internal
     */
    getFilters(): Map<string, TwingFilter> {
        return this.extensionSet.getFilters();
    }

    /**
     * Registers a Test.
     *
     * @param {TwingTest} test
     */
    addTest(test: TwingTest) {
        this.extensionSet.addTest(test);
    }

    /**
     * Gets the registered Tests.
     *
     * @returns {Map<string, TwingTest>}
     */
    getTests() {
        return this.extensionSet.getTests();
    }

    /**
     * Gets a test by name.
     *
     * @param {string} name The test name
     * @returns {TwingTest} A TwingTest instance or null if the test does not exist
     */
    getTest(name: string): TwingTest {
        return this.extensionSet.getTest(name);
    }

    addFunction(aFunction: TwingFunction) {
        this.extensionSet.addFunction(aFunction);
    }

    /**
     * Get a function by name.
     *
     * Subclasses may override this method and load functions differently;
     * so no list of functions is available.
     *
     * @param {string} name function name
     *
     * @returns {TwingFunction} A TwingFunction instance or null if the function does not exist
     *
     * @internal
     */
    getFunction(name: string) {
        return this.extensionSet.getFunction(name);
    }

    registerUndefinedFunctionCallback(callable: Function) {
        this.extensionSet.registerUndefinedFunctionCallback(callable);
    }

    /**
     * Gets registered functions.
     *
     * Be warned that this method cannot return functions defined with registerUndefinedFunctionCallback.
     *
     * @return Twig_Function[]
     *
     * @see registerUndefinedFunctionCallback
     *
     * @internal
     */
    getFunctions() {
        return this.extensionSet.getFunctions();
    }

    /**
     * @param nodeType
     *
     * @return TwingSourceMapNodeConstructor
     */
    getSourceMapNodeConstructor(nodeType: TwingNodeType) {
        let constructor = this.extensionSet.getSourceMapNodeConstructor(nodeType);

        if (!constructor) {
            constructor = TwingSourceMapNode;
        }

        return constructor;
    }

    /**
     * @return Map<TwingNodeType, TwingSourceMapNodeConstructor>
     */
    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor> {
        return this.extensionSet.getSourceMapNodeConstructors();
    }

    /**
     * Registers a Global.
     *
     * New globals can be added before compiling or rendering a template;
     * but after, you can only update existing globals.
     *
     * @param {string} name The global name
     * @param {*} value The global value
     */
    addGlobal(name: string, value: any) {
        if (this.extensionSet.isInitialized() && !this.getGlobals().has(name)) {
            throw new Error(`Unable to add global "${name}" as the runtime or the extensions have already been initialized.`);
        }

        if (this.resolvedGlobals) {
            this.resolvedGlobals.set(name, value);
        } else {
            this.globals.set(name, value);
        }
    }

    /**
     * Gets the registered Globals.
     *
     * @return array An array of globals
     *
     * @internal
     */
    getGlobals(): Map<any, any> {
        if (this.extensionSet.isInitialized()) {
            if (!this.resolvedGlobals) {
                this.resolvedGlobals = merge(this.extensionSet.getGlobals(), this.globals);
            }

            return this.resolvedGlobals;
        }

        return merge(this.extensionSet.getGlobals(), this.globals) as Map<any, any>;
    }

    /**
     * Merges a context with the defined globals.
     *
     * @param {Map<*, *>} context
     * @returns {Map<*, *>}
     */
    mergeGlobals(context: Map<any, any>) {
        // we don't use Twing merge as the context being generally
        // bigger than globals, this code is faster.
        for (let [key, value] of this.getGlobals()) {
            if (!context.has(key)) {
                context.set(key, value);
            }
        }

        return context;
    }

    /**
     * Gets the registered unary Operators.
     *
     * @return Map<string, TwingOperator> A map of unary operators
     *
     * @internal
     */
    getUnaryOperators(): Map<string, TwingOperator> {
        return this.extensionSet.getUnaryOperators();
    }

    /**
     * Gets the registered binary Operators.
     *
     * @return Map<string, TwingOperator> An array of binary operators
     *
     * @internal
     */
    getBinaryOperators(): Map<string, TwingOperator> {
        return this.extensionSet.getBinaryOperators();
    }

    updateOptionsHash() {
        this.optionsHash = [
            this.extensionSet.getSignature(),
            VERSION,
            this.debug,
            this.strictVariables,
            this.sourceMap,
            typeof this.autoescape === 'function' ? 'function' : this.autoescape
        ].join(':');
    }

    /**
     * @param {number} line 0-based
     * @param {number} column 1-based
     * @param {string} name
     * @param {TwingSource} source
     * @param {TwingSourceMapNodeConstructor} ctor
     */
    enterSourceMapBlock(line: number, column: number, name: string, source: TwingSource, ctor: TwingSourceMapNodeConstructor) {
        TwingOutputBuffering.obStart();

        let sourcePath = path.relative('.', source.getPath());

        if (typeof this.sourceMap === 'string') {
            sourcePath = path.join(this.sourceMap, sourcePath);
        }

        source = new TwingSource(source.getCode(), source.getName(), sourcePath);

        let node = new ctor(line, column - 1, source, name);

        if (this.sourceMapNode) {
            this.sourceMapNode.addChild(node);
        }

        this.sourceMapNode = node;
    }

    leaveSourceMapBlock() {
        this.sourceMapNode.content = TwingOutputBuffering.obGetFlush() as string;

        let parent = this.sourceMapNode.parent;

        if (parent) {
            this.sourceMapNode = parent;
        }
    }

    getSourceMap(): string {
        let sourceMap: string = null;

        if (this.isSourceMap() && this.sourceMapNode) {
            let sourceNode = this.sourceMapNode.toSourceNode();

            let codeAndMap = sourceNode.toStringWithSourceMap();

            sourceMap = codeAndMap.map.toString();
        }

        return sourceMap;
    }

    enableSandbox() {
        this.sandboxed = true;
    }

    disableSandbox() {
        this.sandboxed = false;
    }

    isSandboxed() {
        return this.sandboxedGlobally || this.sandboxed;
    }

    isSandboxedGlobally() {
        return this.sandboxedGlobally;
    }

    checkSecurity(tags: Map<string, number>, filters: Map<string, number>, functions: Map<string, number>) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkSecurity(tags, filters, functions);
        }
    }

    checkMethodAllowed(obj: any, method: string) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkMethodAllowed(obj, method);
        }
    }

    checkPropertyAllowed(obj: any, method: string) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkPropertyAllowed(obj, method);
        }
    }

    ensureToStringAllowed(obj: any) {
        if (this.isSandboxed() && typeof obj === 'object') {
            this.sandboxPolicy.checkMethodAllowed(obj, 'toString');
        }

        return obj;
    }
}