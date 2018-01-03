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
import TwingEnvironmentOptions from "./environment-options";
import TwingOperatorDefinitionInterface = require("./operator-definition-interface");
import TwingCacheInterface = require("./cache-interface");
import TwingCacheFilesystem = require("./cache/filesystem");
import TwingCacheNull = require("./cache/null");
import TwingExtensionEscaper = require("./extension/escaper");
import TwingNodeModule from "./node/module";
import TwingTemplate = require("./template");
import TwingError from "./error";

let merge = require('merge');
let fs = require('fs');
let path = require('path');

class TwingEnvironment {
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
    private cache: TwingCacheInterface;
    private lexer: TwingLexer = null;
    private parser: TwingParser = null;
    private baseTemplateClass: string;
    private globals: any = {};
    private resolvedGlobals: any;
    private loadedTemplates: Map<string, TwingTemplate> = new Map();
    private strictVariables: boolean;
    private templateClassPrefix: string = '__TwigTemplate_';
    // private originalCache;
    private extensionSet: TwingExtensionSet = null;
    // private runtimeLoaders = array();
    // private runtimes = array();
    // private optionsHash;
    // private loading = array();

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
            base_template_class: 'TwingTemplate',
            strict_variables: false,
            autoescape: 'html',
            cache: false,
            auto_reload: null,
            optimizations: -1,
        }, options);

//     $this.debug = (bool) $options['debug'];
        this.setCharset(options.charset);
        this.baseTemplateClass = options.base_template_class;
//     $this.autoReload = null === $options['auto_reload'] ? $this.debug : (bool) $options['auto_reload'];
        this.strictVariables = options.strict_variables;
        this.setCache(options.cache);
        this.extensionSet = new TwingExtensionSet();

        this.addExtension(new TwingExtensionCore());
        this.addExtension(new TwingExtensionEscaper(options.autoescape));
        // $this.addExtension(new Twig_Extension_Optimizer($options['optimizations']));
    }

    /**
     * Gets the base template class for compiled templates.
     *
     * @return string The base template class name
     */
    getBaseTemplateClass() {
        return this.baseTemplateClass;
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
        // this.updateOptionsHash();
    }

    /**
     * Disables the strict_variables option.
     */
    disableStrictVariables() {
        this.strictVariables = false;
        // this.updateOptionsHash();
    }

    /**
     * Registers a Test.
     *
     * @param {string} name
     * @param {TwingTest} test
     */
    addTest(name: string, test: TwingTest) {
        this.extensionSet.addTest(name, test);
    }

    /**
     * Gets the registered Tests.
     *
     * @return TwingTest[]
     *
     * @internal
     */
    getTests() {
        return this.extensionSet.getTests();
    }

    /**
     * Gets a test by name.
     *
     * @param {string} name The test name
     * @returns {TwingTest|false} A TwingTest instance or false if the test does not exist
     */
    getTest(name: string) {
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
     * @param string $name function name
     *
     * @return Twig_Function|false A Twig_Function instance or false if the function does not exist
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
        // this.updateOptionsHash();
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

    getCache(): TwingCacheInterface {
        return this.cache;
    }

    setCache(cache: TwingCacheInterface | string | false) {
        if (typeof cache === 'string') {
            cache = new TwingCacheFilesystem(cache);
        }
        else if (cache === false) {
            cache = new TwingCacheNull();
        }

        this.cache = cache;
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
     * Loads a template internal representation.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param string $name  The template name
     * @param int    $index The index if it is an embedded template
     *
     * @return Twig_Template A template instance representing the given template name
     *
     * @throws Twig_Error_Loader  When the template cannot be found
     * @throws Twig_Error_Runtime When a previously generated cache is corrupted
     * @throws Twig_Error_Syntax  When an error occurred during compilation
     *
     * @internal
     */
    loadTemplate(name: string, index: number = null): TwingTemplate {
        if (this.loadedTemplates.has(name)) {
            return this.loadedTemplates.get(name);
        }

        let source = this.getLoader().getSourceContext(name);
        let template = this.compileSource(source);

        this.loadedTemplates.set(name, template);

        return template;
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
    resolveTemplate(names: string | TwingTemplate | Array<string | TwingTemplate>): TwingTemplate {
        let self = this;

        if (!Array.isArray(names)) {
            names = [names];
        }

        let error = null;
        let i: number;

        // we use imperative syntax since we need to break the loop once a template is successfully loaded
        for (i = 0; i < names.length; i++) {
            let name = names[i];

            if (name instanceof TwingTemplate) {
                return name;
            }

            // if (name instanceof TwingTemplateWrapper) {
            //     return name;
            // }

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

        if (names.length === 1) {
            throw error;
        }

        throw new TwingErrorLoader(`Unable to find one of the following templates: "${names.join(', ')}".`);
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
        if (this.lexer === null) {
            this.lexer = new TwingLexer(this);
        }

        return this.lexer.tokenize(source);
    }

    /**
     * Converts a token stream to a template.
     *
     * @param {TwingTokenStream} stream
     * @returns {TwingTemplate}
     *
     * @throws {TwingErrorSyntax} When the token stream is syntactically or semantically wrong
     */
    parse(stream: TwingTokenStream) {
        if (this.parser === null) {
            this.parser = new TwingParser(this);
        }

        return this.parser.parse(stream);
    }

    /**
     *
     * @param {TwingNodeModule} node
     * @returns {TwingTemplate}
     */
    compile(node: TwingNodeModule): TwingTemplate {
        return new TwingTemplate(this, node);
    }

    /**
     *
     * @param {TwingSource} source
     * @returns {TwingTemplate}
     */
    compileSource(source: TwingSource) {
        try {
            return this.compile(this.parse(this.tokenize(source)));
        }
        catch (e) {
            if ( e instanceof TwingError) {
                e.setSourceContext(source);

                throw e;
            }
            else {
                throw new TwingErrorSyntax(`An exception has been thrown during the compilation of a template ("${e.getMessage()}").`, -1, source, e);
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
}

export = TwingEnvironment;