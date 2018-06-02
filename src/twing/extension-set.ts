import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingExtensionStaging} from "./extension/staging";
import {TwingTest} from "./test";
import {TwingEnvironment} from "./environment";
import {merge} from "./helper/merge";
import {TwingOperator} from "./extension";

const isObject = require('isobject');

export class TwingExtensionSet {
    private extensions: Map<string, TwingExtensionInterface>;
    private initialized: boolean = false;
    private runtimeInitialized: boolean = false;
    private staging: TwingExtensionStaging;
    private parsers: TwingTokenParserInterface[];
    private visitors: TwingNodeVisitorInterface[];
    private filters: Map<string, TwingFilter>;
    private tests: Map<string, TwingTest>;
    private functions: Map<string, TwingFunction>;
    private unaryOperators: Map<string, TwingOperator>;
    private binaryOperators: Map<string, TwingOperator>;
    private globals: Map<any, any>;
    private functionCallbacks: Array<Function> = [];
    private filterCallbacks: Array<Function> = [];

    constructor() {
        this.staging = new TwingExtensionStaging();
        this.extensions = new Map();
        this.parsers = [];
    }

    /**
     * Initializes the runtime environment.
     */
    initRuntime(env: TwingEnvironment): void {
        if (this.runtimeInitialized) {
            return;
        }

        this.runtimeInitialized = true;

        for (let [name, extension] of this.extensions) {
            let candidate: any = extension;

            if (candidate.TwingExtensionInitRuntimeInterfaceImpl) {
                candidate.TwingExtensionInitRuntimeInterfaceImpl.initRuntime(env);
            }
        }
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
     * @return Map<string, TwingExtensionInterface> A hash of extensions
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

    getGlobals(): Map<any, any> {
        if (this.globals !== undefined) {
            return this.globals;
        }

        let globals = new Map();

        for (let [name, extension] of this.getExtensions()) {
            let candidate: any = extension;

            if (!candidate.TwingExtensionGlobalsInterfaceImpl) {
                continue;
            }

            let extGlobals = candidate.TwingExtensionGlobalsInterfaceImpl.getGlobals();

            if (!(extGlobals instanceof Map)) {
                throw new Error(`"${extension.constructor.name}[TwingExtensionGlobalsInterface].getGlobals()" must return a Map of globals.`);
            }

            globals = merge(globals, extGlobals) as Map<any, any>;
        }

        if (this.initialized) {
            this.globals = globals;
        }

        return globals;
    }

    /**
     * Registers an extension.
     *
     * @param {TwingExtensionInterface} extension A TwingExtensionInterface instance
     * @param {String} name An optional name the extension will be registered as
     */
    addExtension(extension: TwingExtensionInterface, name: string = null) {
        if (!name) {
            name = extension.constructor.name;
        }

        if (this.initialized) {
            throw new Error(`Unable to register extension "${name}" as extensions have already been initialized.`);
        }

        if (this.extensions.has(name)) {
            throw new Error(`Unable to register extension "${name}" as it is already registered.`);
        }

        this.extensions.set(name, extension);
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
     * @return Map<string, TwingOperator> A map of unary operator definitions
     */
    getUnaryOperators(): Map<string, TwingOperator> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.unaryOperators;
    }

    /**
     * Gets the registered binary Operators.
     *
     * @return Map<string, TwingOperator> A map of binary operators
     */
    getBinaryOperators(): Map<string, TwingOperator> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.binaryOperators;
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

        for (let [pattern, twingFunction] of this.functions) {
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

        for (let callback of this.functionCallbacks) {
            let function_ = callback(name);

            if (function_ !== false) {
                return function_;
            }
        }

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

        for (let callback of this.filterCallbacks) {
            let filter = callback.call(name);

            if (filter !== false) {
                return filter;
            }
        }

        return null;
    }

    registerUndefinedFilterCallback(callable: Function) {
        this.filterCallbacks.push(callable);
    }

    addNodeVisitor(visitor: TwingNodeVisitorInterface) {
        if (this.initialized) {
            throw new Error('Unable to add a node visitor as extensions have already been initialized.');
        }

        this.staging.addNodeVisitor(visitor);
    }

    addTest(test: TwingTest) {
        if (this.initialized) {
            throw new Error(`Unable to add test "${test.getName()}" as extensions have already been initialized.`);
        }

        this.staging.addTest(test);
    }

    /**
     *
     * @returns {Map<string, TwingTest>}
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

    private initExtensions() {
        let self = this;

        this.parsers = [];
        this.filters = new Map();
        this.functions = new Map();
        this.tests = new Map();
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

        if (operators) {
            if (!Array.isArray(operators as any)) {
                throw new Error(`"${extension.constructor.name}.getOperators()" must return an array with operators, got "${isObject(operators) ? operators.constructor.name : typeof operators}".`);
            }

            if (operators.length !== 2) {
                throw new Error(`"${extension.constructor.name}.getOperators()" must return an array of 2 elements, got ${operators.length}.`);
            }

            this.unaryOperators = new Map([...this.unaryOperators, ...operators[0]]);
            this.binaryOperators = new Map([...this.binaryOperators, ...operators[1]]);
        }
    }
}
