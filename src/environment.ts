import TwingTokenParserInterface from "./token-parser-interface";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingExtensionSet from "./extension-set";
import TwingExtensionCore from "./extension/core";
import TwingExtensionInterface from "./extension-interface";
import TwingFilter from "./filter";
import TwingLexer from "./lexer";
import TwingParser from "./parser";
import TwingTokenStream from "./token-stream";
import TwingSource from "./source";
import TwingLoaderInterface from "./loader-interface";
import TwingErrorLoader from "./error/loader";
import TwingMap from "./map";
import TwingTest from "./test";
import TwingFunction from "./function";
import TwingErrorSyntax from "./error/syntax";
import TwingOperatorDefinitionInterface from "./operator-definition-interface";
import TwingExtensionEscaper from "./extension/escaper";
import TwingTemplate from "./template";
import TwingError from "./error";
import TwingTemplateWrapper from "./template-wrapper";
import TwingEnvironmentOptions from "./environment-options";
import {TwingLoaderArray} from "./loader/array";
import TwingLoaderChain from "./loader/chain";
import TwingExtensionOptimizer from "./extension/optimizer";
import TwingCompiler from "./compiler";
import TwingNode from "./node";
import TwingNodeModule from "./node/module";

let merge = require('merge');
let hash = require('hash.js');

export class TwingEnvironment {
    // const VERSION = '2.4.5-DEV';
    // const VERSION_ID = 20405;
    // const MAJOR_VERSION = 2;
    // const MINOR_VERSION = 4;
    // const RELEASE_VERSION = 5;
    // const EXTRA_VERSION = 'DEV';

    private charset: string;
    private loader: TwingLoaderInterface = null;
    private debug: boolean;
    private autoReload: boolean;
    private lexer: TwingLexer;
    private parser: TwingParser;
    private baseTemplateClass: string;
    private globals: any = {};
    private resolvedGlobals: any;
    private strictVariables: boolean;
    private templateClassPrefix = '__TwingTemplate_';
    private extensionSet: TwingExtensionSet = null;
    // private runtimeLoaders = array();
    // private runtimes = array();
    private optionsHash: string;
    // private loading = array();

    protected loadedTemplates: Map<string, TwingTemplate> = new Map();

    /**
     * Constructor.
     *
     * @param {TwingLoaderInterface} loader
     * @param {TwingEnvironmentOptions} options
     */
    constructor(loader: TwingLoaderInterface, options: TwingEnvironmentOptions = null) {
        this.setLoader(loader);

        options = merge({}, {
            debug: false,
            charset: 'UTF-8',
            base_template_class: 'TwingTemplateImpl',
            strict_variables: false,
            autoescape: 'html',
            auto_reload: null,
            optimizations: -1,
        }, options);

        this.debug = options.debug;
        this.setCharset(options.charset);
        this.baseTemplateClass = options.base_template_class;
        this.autoReload = options.auto_reload === null ? this.debug : options.auto_reload;
        this.strictVariables = options.strict_variables;
        this.extensionSet = new TwingExtensionSet();

        this.addExtension(new TwingExtensionCore());
        this.addExtension(new TwingExtensionEscaper(options.autoescape));
        this.addExtension(new TwingExtensionOptimizer(options.optimizations));
    }

    /**
     *
     * @returns {TwingExtensionCore}
     */
    getCoreExtension(): TwingExtensionCore {
        return this.getExtension('TwingExtensionCore') as TwingExtensionCore;
    }

    /**
     * Gets the base template class for compiled templates.
     *
     * @returns {string} The base template class name
     */
    getBaseTemplateClass() {
        return this.baseTemplateClass;
    }

    /**
     * Sets the base template class for compiled templates.
     *
     * @param {string} templateClass The base template class name
     */
    public setBaseTemplateClass(templateClass: string) {
        this.baseTemplateClass = templateClass;
        this.updateOptionsHash();
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
     * Checks if the strict_variables option is enabled.
     *
     * @returns {boolean} true if strict_variables is enabled, false otherwise
     */
    isStrictVariables() {
        return this.strictVariables;
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
     * @returns {TwingMap<string, TwingTest>}
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
     * Gets the registered Token Parsers.
     *
     * @return TwingTokenParserInterface[]
     *
     * @internal
     */
    getTokenParsers() {
        return this.extensionSet.getTokenParsers();
    }

    /**
     * Gets the registered Node Visitors.
     *
     * @return Array<TwingNodeVisitorInterface>
     *
     * @internal
     */
    getNodeVisitors(): Array<TwingNodeVisitorInterface> {
        return this.extensionSet.getNodeVisitors();
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

    addExtension(extension: TwingExtensionInterface) {
        this.extensionSet.addExtension(extension);
        this.updateOptionsHash();
    }

    /**
     * Registers a Global.
     *
     * New globals can be added before compiling or rendering a template;
     * but after, you can only update existing globals.
     *
     * @param {string} name The global name
     * @param value         The global value
     */
    addGlobal(name: string, value: any) {
        if (this.extensionSet.isInitialized() && !Reflect.has(this.getGlobals(), name)) {
            throw new Error(`Unable to add global "${name}" as the runtime or the extensions have already been initialized.`);
        }

        if (this.resolvedGlobals) {
            this.resolvedGlobals[name] = value;
        }
        else {
            this.globals[name] = value;
        }
    }

    /**
     * Gets the registered Globals.
     *
     * @return array An array of globals
     *
     * @internal
     */
    getGlobals(): {} {
        if (this.extensionSet.isInitialized()) {
            if (!this.resolvedGlobals) {
                this.resolvedGlobals = merge.recursive({}, this.extensionSet.getGlobals(), this.globals);
            }

            return this.resolvedGlobals;
        }

        return merge.recursive({}, this.extensionSet.getGlobals(), this.globals);
    }

    /**
     * Merges a context with the defined globals.
     *
     * @param {TwingMap<string, {}>} context
     * @returns {TwingMap<string, {}>}
     */
    mergeGlobals(context: any) {
        let k: any;
        let globals: any = this.getGlobals();

        for (k in globals) {
            if (!context[k]) {
                context[k] = globals[k];
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
    getUnaryOperators(): Map<string, TwingOperatorDefinitionInterface> {
        return this.extensionSet.getUnaryOperators();
    }

    /**
     * Gets the registered binary Operators.
     *
     * @return Map<string, TwingOperator> An array of binary operators
     *
     * @internal
     */
    getBinaryOperators(): Map<string, TwingOperatorDefinitionInterface> {
        return this.extensionSet.getBinaryOperators();
    }

    addTokenParser(parser: TwingTokenParserInterface) {
        this.extensionSet.addTokenParser(parser);
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
     * Gets the template class associated with the given string.
     *
     * The generated template class is based on the following parameters:
     *
     *  * The cache key for the given template;
     *  * The currently enabled extensions;
     *  * Whether the Twig C extension is available or not;
     *  * PHP version;
     *  * Twig version;
     *  * Options with what environment was created.
     *
     * @param {string} name The name for which to calculate the template class name
     * @param {number|null} index The index if it is an embedded template
     *
     * @return string The template class name
     */
    getTemplateClass(name: string, index: number = null) {
        let key = this.getLoader().getCacheKey(name) + this.optionsHash;

        return this.templateClassPrefix + hash.sha256().update(key).digest('hex') + (index === null ? '' : '_' + index);
    }

    /**
     * Renders a template.
     *
     * @param {string} name The template name
     * @param {{}} context  An array of parameters to pass to the template
     * @returns {string}
     */
    render(name: string, context: any = {}) {
        return this.loadTemplate(name).render(context);
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
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name  The template name
     * @param {number} index The index if it is an embedded template
     *
     * @returns {TwingTemplate} A template instance representing the given template name
     *
     * @throws {TwingErrorLoader} When the template cannot be found
     * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
     * @throws {TwingErrorSyntax} When an error occurred during compilation
     *
     * @internal
     */
    loadTemplate(name: string, index: number = null): TwingTemplate {
        let cls = this.getTemplateClass(name);

        if (index !== null) {
            cls = `${cls}_${index}`;
        }

        if (this.loadedTemplates.has(cls)) {
            return this.loadedTemplates.get(cls);
        }

        let source = this.getLoader().getSourceContext(name);
        let templates: Map<number, TwingTemplate>;

        try {
            templates = this.compileSource(source);

            for (let [index, template] of templates) {
                let cls = this.getTemplateClass(name, index);

                this.loadedTemplates.set(cls, template);
            }

            return templates.get(null);
        }
        catch (e) {
            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(source);
                }
            }

            throw e;
        }
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
        let name = `__string_template__${hash.sha256().update(template).digest('hex')}`;
        let current = this.getLoader();

        let loader = new TwingLoaderChain([
            new TwingLoaderArray(new Map([[name, template]])),
            current,
        ]);

        this.setLoader(loader);

        try {
            result = this.loadTemplate(name);
        }
        finally {
            this.setLoader(current);
        }

        return result;
    }

    /**
     * Tries to load a template consecutively from an array.
     *
     * Similar to loadTemplate() but it also accepts TwingTemplate instances and an array
     * of templates where each is tried to be loaded.
     *
     * @param names string|TwingTemplate|Array<string|TwingTemplate> A template or an array of templates to try consecutively
     *
     * @return TwingTemplate
     *
     * @throws TwingErrorLoader When none of the templates can be found
     * @throws TwingErrorSyntax When an error occurred during compilation
     */
    resolveTemplate(names: string | TwingTemplate | TwingTemplateWrapper | Array<string | TwingTemplate>): TwingTemplate | TwingTemplateWrapper {
        let self = this;
        let namesArray: Array<any>;

        if (!Array.isArray(names)) {
            namesArray = [names];
        }
        else {
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
                return self.loadTemplate(name);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    error = e;
                }
                else {
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

    setParser(parser: TwingParser) {
        this.parser = parser;
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
    compile(node: TwingNode): Map<number, TwingTemplate> {
        let compiler = new TwingCompiler(this);

        return compiler.compile(node).getTemplates();
    }

    /**
     *
     * @param {TwingSource} source
     * @returns {Map<number, TwingTemplate> }
     */
    compileSource(source: TwingSource): Map<number, TwingTemplate> {
        try {
            return this.compile(this.parse(this.tokenize(source)));
        }
        catch (e) {
            if (e instanceof TwingError) {
                throw e;
            }
            else {
                // console.warn(e);

                throw new TwingErrorSyntax(`An exception has been thrown during the compilation of a template ("${e.message}").`, -1, source, e);
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
     * Gets an extension by name.
     *
     * @param {string} name
     * @returns {TwingExtensionInterface}
     */
    getExtension(name: string) {
        return this.extensionSet.getExtension(name);
    }

    updateOptionsHash() {
        let nodeVersionComponents = process.versions.node.split('.');

        this.optionsHash = [
            this.extensionSet.getSignature(),
            nodeVersionComponents[0],
            nodeVersionComponents[1],
            process.env.npm_package_version,
            this.debug,
            this.baseTemplateClass,
            this.strictVariables,
        ].join(':');
    }
}

export default TwingEnvironment;