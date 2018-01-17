import TwingTokenParserInterface from "./token-parser-interface";
import TwingFilter from "./filter";
import TwingFunction from "./function";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingExtensionInterface from "./extension-interface";
import TwingExtensionStaging from "./extension/staging";
import TwingMap from "./map";
import TwingOperatorDefinitionInterface from "./operator-definition-interface";
import TwingTest from "./test";

let preg_quote = require('locutus/php/pcre/preg_quote');

class TwingExtensionSet {
    private extensions: Map<string, TwingExtensionInterface>;
    private filters: Map<string, TwingFilter>;
    private filterCallbacks: Array<Function> = [];
    private functions: TwingMap<string, TwingFunction>;
    private functionCallbacks: Array<Function> = [];
    private initialized: boolean = false;
    private runtimeInitialized: boolean = false;
    private parsers: TwingTokenParserInterface[];
    private tests: TwingMap<string, TwingTest>;
    private visitors: TwingNodeVisitorInterface[];
    private unaryOperators: Map<string, TwingOperatorDefinitionInterface>;
    private binaryOperators: Map<string, TwingOperatorDefinitionInterface>;
    private globals: TwingMap<string, {}>;
    private staging: TwingExtensionStaging;

    constructor() {
        this.staging = new TwingExtensionStaging();
        this.extensions = new Map();
        this.parsers = [];
    }

    hasExtension(name: string) {
        return this.extensions.has(name);
    }

    getExtension(name: string) {
        return this.extensions.get(name);
    }

    /**
     * Registers an array of extensions.
     *
     * @param array $extensions An array of extensions
     */
    setExtensions(extensions: Array<TwingExtensionInterface>) {
        for (let extension of extensions) {
            this.addExtension(extension);
        }
    }

    /**
     * Returns all registered extensions.
     *
     * @return array An array of extensions
     */
    getExtensions() {
        return this.extensions;
    }

    getSignature() {
        return JSON.stringify([...this.extensions.keys()]);
    }

    isInitialized() {
        return this.initialized || this.runtimeInitialized;
    }

    getNodeVisitors(): TwingNodeVisitorInterface[] {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.visitors;
    }

    getTokenParsers(): TwingTokenParserInterface[] {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.parsers;
    }

    getGlobals() {
        if (this.globals) {
            return this.globals;
        }

        let globals = new TwingMap();


        if (this.initialized) {
            this.globals = globals;
        }

        return globals;
    }

    /**
     * Registers an extension.
     *
     * @param extension TwingExtensionInterface A TwingExtensionInterface instance
     */
    addExtension(extension: TwingExtensionInterface) {
        let extensionClass: string = extension.constructor.name;

        if (this.initialized) {
            throw new Error(`Unable to register extension "${extensionClass}" as extensions have already been initialized.`);
        }

        if (this.extensions.has(extensionClass)) {
            throw new Error(`Unable to register extension "${extensionClass}" as it is already registered.`);
        }

        this.extensions.set(extensionClass, extension);
    }

    addTokenParser(parser: TwingTokenParserInterface) {
        if (this.initialized) {
            throw new Error('Unable to add a token parser as extensions have already been initialized.');
        }

        this.staging.addTokenParser(parser);
    }

    /**
     * Gets the registered unary Operators.
     *
     * @return Map<string, TwingOperatorDefinitionInterface> A map of unary operator definitions
     */
    getUnaryOperators(): Map<string, TwingOperatorDefinitionInterface> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.unaryOperators;
    }

    /**
     * Gets the registered binary Operators.
     *
     * @return Map<string, TwingOperatorDefinitionInterface> A map of binary operators
     */
    getBinaryOperators(): Map<string, TwingOperatorDefinitionInterface> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.binaryOperators;
    }

    private initExtensions() {
        let self = this;

        this.parsers = [];
        this.filters = new Map();
        this.functions = new TwingMap();
        this.tests = new TwingMap();
        this.visitors = [];
        this.unaryOperators = new Map();
        this.binaryOperators = new Map();

        this.extensions.forEach(function (extension) {
            self.initExtension(extension);
        });

        this.initExtension(this.staging);

        // Done at the end only, so that an exception during initialization does not mark the environment as initialized when catching the exception
        this.initialized = true;
    }

    private initExtension(extension: TwingExtensionInterface) {
        let self = this;

        // filters
        extension.getFilters().forEach(function (filter) {
            self.filters.set(filter.getName(), filter);
        });

        // functions
        extension.getFunctions().forEach(function (function_: TwingFunction) {
            self.functions.set(function_.getName(), function_);
        });

        // tests
        extension.getTests().forEach(function (test: TwingTest) {
            self.tests.set(test.getName(), test);
        });

        // token parsers
        extension.getTokenParsers().forEach(function (parser) {
            // if (!parser instanceof Twig_TokenParserInterface) {
            //     throw new Error('getTokenParsers() must return an array of Twig_TokenParserInterface.');
            // }

            self.parsers.push(parser);
        });

        // node visitors
        extension.getNodeVisitors().forEach(function (visitor) {
            self.visitors.push(visitor);
        });

        // operators
        let operators = extension.getOperators();

        this.unaryOperators = new Map([...this.unaryOperators, ...operators.unary]);
        this.binaryOperators = new Map([...this.binaryOperators, ...operators.binary]);
    }


    addFunction(twingFunction: TwingFunction) {
        if (this.initialized) {
            throw new Error(`Unable to add function "${twingFunction.getName()}" as extensions have already been initialized.`);
        }

        this.staging.addFunction(twingFunction);
    }

    getFunctions() {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.functions;
    }

    /**
     * Get a function by name.
     *
     * @param {string} name         function name
     * @returns {TwingFunction}     A TwingFunction instance or null if the function does not exist
     */
    getFunction(name: string): TwingFunction {
        if (!this.initialized) {
            this.initExtensions();
        }

        if (this.functions.has(name)) {
            return this.functions.get(name);
        }

        let twingFunction: TwingFunction;
        let pattern: string;

        for ([pattern, twingFunction] of this.functions) {
            let count: number = 0;

            pattern = pattern.replace(/\*/g, function (match: string, value: string) {
                count++;

                return '(.*?)';
            });

            if (count) {
                let regExp = new RegExp('^' + pattern, 'g');
                let match: RegExpExecArray = regExp.exec(name);
                let matches = [];

                if (match) {
                    for (let i = 1; i <= count; i++) {
                        matches.push(match[i]);
                    }

                    twingFunction.setArguments(matches);

                    return twingFunction;
                }
            }
        }

        this.functionCallbacks.forEach(function (callback) {
            let function_ = callback(name);

            if (function_ !== false) {
                return function_;
            }
        });

        return null;
    }

    registerUndefinedFunctionCallback(callable: Function) {
        this.functionCallbacks.push(callable);
    }

    addFilter(filter: TwingFilter) {
        if (this.initialized) {
            throw new Error(`Unable to add filter "${filter.getName()}" as extensions have already been initialized.`);
        }

        this.staging.addFilter(filter);
    }

    getFilters(): Map<string, TwingFilter> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.filters;
    }

    /**
     * Get a filter by name.
     *
     * Subclasses may override this method and load filters differently;
     * so no list of filters is available.
     *
     * @param string name The filter name
     *
     * @return Twig_Filter|false A Twig_Filter instance or false if the filter does not exist
     */
    getFilter(name: string): TwingFilter {
        if (!this.initialized) {
            this.initExtensions();
        }

        if (this.filters.has(name)) {
            return this.filters.get(name);
        }

        let filter: TwingFilter;
        let pattern: string;

        for ([pattern, filter] of this.filters) {
            let count: number = 0;

            pattern = pattern.replace(/\*/g, function (match: string, value: string) {
                count++;

                return '(.*?)';
            });

            if (count) {
                let regExp = new RegExp('^' + pattern, 'g');
                let match: RegExpExecArray = regExp.exec(name);
                let matches = [];

                if (match) {
                    for (let i = 1; i <= count; i++) {
                        matches.push(match[i]);
                    }

                    filter.setArguments(matches);

                    return filter;
                }
            }
        }

        this.filterCallbacks.forEach(function (callback: Function) {
            let filter = callback.call(this, name);

            if (filter !== false) {
                return filter;
            }
        });

        return null;
    }

    registerUndefinedFilterCallback(callable: Function) {
        this.filterCallbacks.push(callable);
    }


    addTest(test: TwingTest) {
        if (this.initialized) {
            throw new Error(`Unable to add test "${test.getName()}" as extensions have already been initialized.`);
        }

        this.staging.addTest(test);
    }

    /**
     *
     * @returns {TwingMap<string, TwingTest>}
     */
    getTests() {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.tests;
    }

    /**
     * Gets a test by name.
     *
     * @param {string} name The test name
     * @returns {TwingTest} A TwingTest instance or null if the test does not exist
     */
    getTest(name: string): TwingTest {
        if (!this.initialized) {
            this.initExtensions();
        }

        if (this.tests.has(name)) {
            return this.tests.get(name);
        }

        return null;
    }
}

export default TwingExtensionSet;