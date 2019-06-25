import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingTest} from "./test";
import {merge} from "./helpers/merge";
import {TwingOperator, TwingOperatorType} from "./operator";
import {TwingNodeType} from "./node";
import {TwingSourceMapNodeConstructor} from "./source-map/node";
import {TwingEnvironment} from "./environment";

export class TwingExtensionSet {
    private initialized: boolean = false;
    private runtimeInitialized: boolean = false;
    private visitors: TwingNodeVisitorInterface[] = [];
    private filters: Map<string, TwingFilter> = new Map();
    private tests: Map<string, TwingTest> = new Map();
    private functions: Map<string, TwingFunction> = new Map();
    private unaryOperators: Map<string, TwingOperator> = new Map();
    private binaryOperators: Map<string, TwingOperator> = new Map();
    private tokenParsers: Map<string, TwingTokenParserInterface> = new Map();
    private functionCallbacks: Array<Function> = [];
    private filterCallbacks: Array<Function> = [];
    private sourceMapNodeConstructors: Map<TwingNodeType, TwingSourceMapNodeConstructor> = new Map();
    private globals: Map<any, any>;

    readonly extensions: Map<string, TwingExtensionInterface>;

    constructor() {
        this.extensions = new Map();
    }

    /**
     * Initializes the runtime environment.
     */
    initRuntime(env: TwingEnvironment): void {
        if (this.runtimeInitialized) {
            return;
        }

        this.runtimeInitialized = true;

        for (let extension of this.extensions.values()) {
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
     * @param {Array<TwingExtensionInterface>} extensions An array of extensions
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

        return Array.from(this.tokenParsers.values());
    }

    getGlobals(): Map<any, any> {
        if (this.globals !== undefined) {
            return this.globals;
        }

        let globals = new Map();

        for (let extension of this.getExtensions().values()) {
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

        if (this.tokenParsers.has(parser.getTag())) {
            throw new Error(`Tag "${parser.getTag()}" is already registered.`);
        }

        this.tokenParsers.set(parser.getTag(), parser);
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

        if (this.functions.has(twingFunction.getName())) {
            throw new Error(`Function "${twingFunction.getName()}" is already registered.`);
        }

        this.functions.set(twingFunction.getName(), twingFunction);
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
                let regExp = new RegExp('^' + pattern + '$', 'g');
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

        if (this.filters.has(filter.getName())) {
            throw new Error(`Filter "${filter.getName()}" is already registered.`);
        }

        this.filters.set(filter.getName(), filter);
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
     * @param {string} name The filter name
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
                let regExp = new RegExp('^' + pattern + '$', 'g');
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

        this.visitors.push(visitor);
    }

    addTest(test: TwingTest) {
        if (this.initialized) {
            throw new Error(`Unable to add test "${test.getName()}" as extensions have already been initialized.`);
        }

        if (this.tests.has(test.getName())) {
            throw new Error(`Test "${test.getName()}" is already registered.`);
        }

        this.tests.set(test.getName(), test);
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

        let test: TwingTest;
        let pattern: string;

        for ([pattern, test] of this.tests) {
            let count: number = 0;

            pattern = pattern.replace(/\*/g, function (match: string, value: string) {
                count++;

                return '(.*?)';
            });

            if (count) {
                let regExp = new RegExp('^' + pattern + '$', 'g');
                let match: RegExpExecArray = regExp.exec(name);
                let matches = [];

                if (match) {
                    for (let i = 1; i <= count; i++) {
                        matches.push(match[i]);
                    }

                    test.setArguments(matches);

                    return test;
                }
            }
        }

        return null;
    }

    addOperator(operator: TwingOperator) {
        if (this.initialized) {
            throw new Error(`Unable to add operator "${operator.getName()}" as extensions have already been initialized.`);
        }

        let bucket: Map<string, TwingOperator>;

        if (operator.getType() === TwingOperatorType.UNARY) {
            bucket = this.unaryOperators;
        } else {
            bucket = this.binaryOperators;
        }

        if (bucket.has(operator.getName())) {
            throw new Error(`Operator "${operator.getName()}" is already registered.`);
        }

        bucket.set(operator.getName(), operator);
    }

    /**
     * @return Map<TwingNodeType, TwingSourceMapNodeConstructor>
     */
    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.sourceMapNodeConstructors;
    }

    /**
     * @param nodeType
     *
     * @return TwingSourceMapNodeConstructor | null
     */
    getSourceMapNodeConstructor(nodeType: TwingNodeType) {
        return this.sourceMapNodeConstructors.has(nodeType) ? this.sourceMapNodeConstructors.get(nodeType) : null;
    }

    protected initExtensions() {
        for (let extension of this.extensions.values()) {
            this.initExtension(extension);
        }

        this.initialized = true;
    }

    protected initExtension(extension: TwingExtensionInterface) {
        // filters
        for (let filter of extension.getFilters()) {
            this.addFilter(filter);
        }

        // functions
        for (let function_ of extension.getFunctions()) {
            this.addFunction(function_);
        }

        // tests
        for (let test of extension.getTests()) {
            this.addTest(test);
        }

        // operators
        for (let operator of extension.getOperators()) {
            this.addOperator(operator);
        }

        // token parsers
        for (let parser of extension.getTokenParsers()) {
            this.addTokenParser(parser);
        }

        // node visitors
        for (let visitor of extension.getNodeVisitors()) {
            this.addNodeVisitor(visitor);
        }

        // source-map node constructors
        let constructors = extension.getSourceMapNodeConstructors();

        for (let [nodeType, constructor] of constructors) {
            this.sourceMapNodeConstructors.set(nodeType, constructor);
        }
    }
}
