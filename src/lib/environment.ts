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
import {TwingCacheInterface} from "./cache-interface";
import {TwingCompiler} from "./compiler";
import {TwingNodeModule} from "./node/module";
import {TwingCacheNull} from "./cache/null";
import {TwingErrorRuntime} from "./error/runtime";
import {EventEmitter} from 'events';
import {TwingOutputBuffering} from "./output-buffering";
import {TwingSourceMapNode} from "./source-map/node";
import {TwingOperator} from "./operator";
import {TwingSandboxSecurityPolicy} from "./sandbox/security-policy";
import {TwingSandboxSecurityPolicyInterface} from "./sandbox/security-policy-interface";
import {TwingEnvironmentOptions} from "./environment-options";
import {TwingNodeType} from "./node";
import {TwingSourceMapNodeFactory} from "./source-map/node-factory";

const path = require('path');
const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

type TwingTemplateConstructor = new(e: TwingEnvironment) => TwingTemplate;

export type TwingTemplatesModule = (T: typeof TwingTemplate) => Map<number, TwingTemplateConstructor>;

export const VERSION = '__VERSION__';

/**
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
    private loadedTemplates: Map<string, TwingTemplate> = new Map();
    private strictVariables: boolean;
    private originalCache: TwingCacheInterface | string | false;
    private extensionSet: TwingExtensionSet = null;
    private optionsHash: string;
    private sourceMapNode: TwingSourceMapNode;
    private sourceMap: boolean | string;
    private autoescape: string | boolean | Function;
    private coreExtension: TwingExtensionCore;
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
        this.sandboxed = options.sandboxed;
        this.sandboxPolicy = options.sandbox_policy;

        this.setCoreExtension(new TwingExtensionCore(options.autoescape));
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
     * @param {TwingCacheInterface|string|string|false} cache A TwingCacheInterface implementation, a string or false to disable cache
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

    protected abstract cacheFromString(cache: string): TwingCacheInterface;

    protected get templateConstructor(): typeof TwingTemplate {
        return TwingTemplate;
    }

    /**
     * Gets the template class associated with the given string.
     *
     * The generated template class is based on the following parameters:
     *
     *  * The cache key for the given template;
     *  * The currently enabled extensions;
     *  * Twing version;
     *  * Options with what environment was created.
     *
     * @param {string} name The name for which to calculate the template class name
     * @param {number} index The index of the template
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @return string The template hash
     */
    protected getTemplateHash(name: string, index: number = 0, from: TwingSource = null) {
        let key = this.getLoader().getCacheKey(name, from) + this.optionsHash;

        return hex.stringify(sha256(key)) + (index === 0 ? '' : '_' + index);
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
     * @param {string | TwingTemplate} name The template name
     *
     * @throws {TwingErrorLoader}  When the template cannot be found
     * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
     * @throws {TwingErrorSyntax}  When an error occurred during compilation
     *
     * @returns {TwingTemplate}
     */
    load(name: string | TwingTemplate) {
        if (name instanceof TwingTemplate) {
            return name;
        }

        return this.loadTemplate(name);
    }

    /**
     * Register a template under an arbitrary name.
     *
     * @param {TwingTemplate} template The template to register
     * @param {string} name The name of the template
     */
    protected registerTemplate(template: TwingTemplate, name: string): void {
        this.loadedTemplates.set(name, template);
    }

    /**
     * Register a templates module under an arbitrary name.
     *
     * @param {TwingTemplatesModule} module
     * @param {string} name
     */
    registerTemplatesModule(module: TwingTemplatesModule, name: string) {
        let templates = module(this.templateConstructor);

        for (let [index, constructor] of templates) {
            let template = new constructor(this);
            this.registerTemplate(template, name + (index !== 0 ? '_' + index : ''));
        }
    }

    /**
     * Loads a template internal representation.
     *
     * @param {string} name The template name
     * @param {number} index The index of the template
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @returns {TwingTemplate} A template instance representing the given template name
     *
     * @throws {TwingErrorLoader}  When the template cannot be found
     * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
     * @throws {TwingErrorSyntax}  When an error occurred during compilation
     */
    loadTemplate(name: string, index: number = 0, from: TwingSource = null): TwingTemplate {
        this.emit('template', name, from);

        let cacheKey: string = name + (index !== 0 ? '_' + index : '');

        if (this.loadedTemplates.has(cacheKey)) {
            return this.loadedTemplates.get(cacheKey);
        }

        let mainTemplateHash = this.getTemplateHash(name, 0, from);
        let templateHash = this.getTemplateHash(name, index, from);

        if (this.loadedTemplates.has(templateHash)) {
            return this.loadedTemplates.get(templateHash);
        }

        let cache = this.cache as TwingCacheInterface;

        cacheKey = cache.generateKey(name, mainTemplateHash);

        let templates: Map<number, TwingTemplateConstructor> = new Map();
        let templateConstructor = this.templateConstructor;

        if (!this.isAutoReload() || this.isTemplateFresh(name, cache.getTimestamp(cacheKey), from)) {
            templates = cache.load(cacheKey)(templateConstructor);
        }

        if (!templates.has(index)) {
            let source = this.getLoader().getSourceContext(name, from);
            let content = this.compileSource(source);

            cache.write(cacheKey, content);

            templates = cache.load(cacheKey)(templateConstructor);

            if (!templates.has(index)) {
                let templatesModule = this.getTemplatesModule(content);

                templates = templatesModule(templateConstructor);

                if (!templates.has(index)) {
                    throw new TwingErrorRuntime(`Failed to load Twig template "${name}", index "${index}": cache is corrupted.`, -1, source);
                }
            }
        }

        let mainTemplate: TwingTemplate;

        for (let [index, constructor] of templates) {
            let template = new constructor(this);

            if (index === 0) {
                mainTemplate = template;
            }

            this.registerTemplate(template, this.getTemplateHash(name, index, from));
        }

        return mainTemplate;
    }

    /**
     * Creates a template from source.
     *
     * This method should not be used as a generic way to load templates.
     *
     * @param {string} template The template name
     * @param {string} name An optional name for the template to be used in error messages
     *
     * @returns {TwingTemplate} A template instance representing the given template name
     *
     * @throws TwingErrorLoader When the template cannot be found
     * @throws TwingErrorSyntax When an error occurred during compilation
     */
    createTemplate(template: string, name: string = null): TwingTemplate {
        let hash: string = hex.stringify(sha256(template));

        if (name !== null) {
            name = `${name} (string template ${hash})`;
        } else {
            name = `__string_template__${hash}`;
        }

        let templatesModule = this.getTemplatesModule(this.compileSource(new TwingSource(template, name)));

        this.registerTemplatesModule(templatesModule, name);

        return this.loadTemplate(name);
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
     * Tries to load templates consecutively from an array.
     *
     * Similar to loadTemplate() but it also accepts instances of TwingTemplate and an array of templates where each is tried to be loaded.
     *
     * @param {string|TwingTemplate|Array<string|TwingTemplate>} names A template or an array of templates to try consecutively
     * @param {TwingSource} from The source of the template that initiated the resolving.
     * @returns {TwingTemplate}
     *
     * @throws {TwingErrorLoader} When none of the templates can be found
     * @throws {TwingErrorSyntax} When an error occurred during compilation
     */
    resolveTemplate(names: string | TwingTemplate | Array<string | TwingTemplate>, from: TwingSource): TwingTemplate {
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

            try {
                return self.loadTemplate(name, 0, from);
            } catch (e) {
                if (e instanceof TwingErrorLoader) {
                    if (e.getSourceContext().getName() !== from.getName()) {
                        throw e;
                    }

                    error = e;
                } else {
                    throw e;
                }
            }
        }

        if (namesArray.length === 1) {
            throw error;
        }

        throw new TwingErrorLoader(`Unable to find one of the following templates: "${namesArray.join(', ')}".`, -1, from);
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
    tokenize(source: TwingSource): TwingTokenStream {
        if (!this.lexer) {
            this.lexer = new TwingLexer(this);
        }

        let stream = this.lexer.tokenizeSource(source);

        return new TwingTokenStream(stream.toAst(), stream.getSourceContext());
    }

    setParser(parser: TwingParser) {
        this.parser = parser;
    }

    /**
     * Converts a token list to a template.
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
     * Compiles a module node.
     *
     * @returns {string}
     */
    compile(node: TwingNodeModule) {
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

    /**
     * @returns {TwingTemplatesModule}
     */
    private getTemplatesModule(content: string): TwingTemplatesModule {
        let resolver = new Function(`let module = {
    exports: undefined
};

${content}

return module.exports;

`);

        return resolver();
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
     * Gets an extension by name.
     *
     * @param {string} name
     * @returns {TwingExtensionInterface}
     */
    getExtension(name: string) {
        return this.extensionSet.getExtension(name);
    }

    /**
     *
     * @param {TwingExtensionInterface} extension
     * @param {string} name A name the extension will be registered as
     */
    addExtension(extension: TwingExtensionInterface, name: string) {
        this.extensionSet.addExtension(extension, name);
        this.updateOptionsHash();
    }

    /**
     * Registers some extensions.
     *
     * @param {Map<string, TwingExtensionInterface>} extensions
     */
    addExtensions(extensions: Map<string, TwingExtensionInterface>) {
        this.extensionSet.addExtensions(extensions);
        this.updateOptionsHash();
    }

    /**
     * Returns all registered extensions.
     *
     * @returns Map<string, TwingExtensionInterface>
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
     * @param {string} name
     *
     * @return Twig_Filter|false A Twig_Filter instance or null if the filter does not exist
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
     * @return TwingSourceMapNodeFactory
     */
    getSourceMapNodeFactory(nodeType: TwingNodeType) {
        return this.extensionSet.getSourceMapNodeFactory(nodeType);
    }

    /**
     * @return Map<TwingNodeType, TwingSourceMapNodeFactory>
     */
    getSourceMapNodeFactories(): Map<TwingNodeType, TwingSourceMapNodeFactory> {
        return this.extensionSet.getSourceMapNodeFactories();
    }

    /**
     * Registers a Global.
     *
     * New globals can be added before compiling or rendering a template, but after, you can only update existing globals.
     *
     * @param {string} name The global name
     * @param {*} value The global value
     */
    addGlobal(name: string, value: any) {
        if (this.extensionSet.isInitialized() && !this.getGlobals().has(name)) {
            throw new Error(`Unable to add global "${name}" as the extensions have already been initialized.`);
        }

        this.globals.set(name, value);
    }

    /**
     * Gets the registered Globals.
     *
     * @return Map<any, any> A map of globals
     */
    getGlobals(): Map<any, any> {
        return this.globals;
    }

    /**
     * Merges a context with the defined globals.
     *
     * @param {Map<*, *>} context
     * @returns {Map<*, *>}
     */
    mergeGlobals(context: Map<any, any>) {
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
     * @param {TwingNodeType} nodeType
     * @param {TwingSource} source
     */
    enterSourceMapBlock(line: number, column: number, nodeType: TwingNodeType, source: TwingSource) {
        TwingOutputBuffering.obStart();

        let sourcePath = path.relative('.', source.getPath());

        if (typeof this.sourceMap === 'string') {
            sourcePath = path.join(this.sourceMap, sourcePath);
        }

        source = new TwingSource(source.getCode(), source.getName(), sourcePath);

        let factory = this.getSourceMapNodeFactory(nodeType);

        if (!factory) {
            factory = new TwingSourceMapNodeFactory(nodeType);
        }

        let node = factory.create(line, column - 1, source);

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
        return this.sandboxed;
    }

    checkSecurity(tags: string[], filters: string[], functions: string[]) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkSecurity(tags, filters, functions);
        }
    }

    checkMethodAllowed(obj: any, method: string) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkMethodAllowed(obj, method);
        }
    }

    checkPropertyAllowed(obj: any, property: string) {
        if (this.isSandboxed()) {
            this.sandboxPolicy.checkPropertyAllowed(obj, property);
        }
    }

    ensureToStringAllowed(obj: any) {
        if (this.isSandboxed() && typeof obj === 'object') {
            this.sandboxPolicy.checkMethodAllowed(obj, 'toString');
        }

        return obj;
    }
}
