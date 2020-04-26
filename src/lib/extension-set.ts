import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingExtensionInterface} from "./extension-interface";
import {TwingTest} from "./test";
import {TwingOperator, TwingOperatorType} from "./operator";
import {TwingSourceMapNodeFactory} from "./source-map/node-factory";
import {TwingNodeType} from "./node-type";

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
    private sourceMapNodeFactories: Map<string, TwingSourceMapNodeFactory> = new Map();

    readonly extensions: Map<string, TwingExtensionInterface>;

    constructor() {
        this.extensions = new Map();
    }

    hasExtension(name: string) {
        return this.extensions.has(name);
    }

    getExtension(name: string) {
        return this.extensions.get(name);
    }

    /**
     * Registers somes extensions.
     *
     * @param {Map<string, TwingExtensionInterface>} extensions
     */
    addExtensions(extensions: Map<string, TwingExtensionInterface>) {
        for (let [name, extension] of extensions) {
            this.addExtension(extension, name);
        }
    }

    /**
     * Returns all registered extensions.
     *
     * @return Map<string, TwingExtensionInterface>
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

        return [...this.tokenParsers.values()];
    }

    /**
     * Registers an extension.
     *
     * @param {TwingExtensionInterface} extension A TwingExtensionInterface instance
     * @param {string} name A name the extension will be registered as
     */
    addExtension(extension: TwingExtensionInterface, name: string) {
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
            throw new Error(`Unable to add token parser "${parser.getTag()}" as extensions have already been initialized.`);
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

        return null;
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
     * @param {string} name The filter name
     *
     * @return {TwingFilter|false} A TwingFilter instance or false if the filter does not exist
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

        return null;
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

    addSourceMapNodeFactory(factory: TwingSourceMapNodeFactory) {
        if (this.initialized) {
            throw new Error(`Unable to add source-map node factory "${factory.nodeName}" as extensions have already been initialized.`);
        }

        if (this.sourceMapNodeFactories.has(factory.nodeName)) {
            throw new Error(`Source-map node factory "${factory.nodeName}" is already registered.`);
        }

        this.sourceMapNodeFactories.set(factory.nodeName, factory);
    }

    /**
     * @return Map<TwingNodeType, TwingSourceMapNodeFactory>
     */
    getSourceMapNodeFactories(): Map<string, TwingSourceMapNodeFactory> {
        if (!this.initialized) {
            this.initExtensions();
        }

        return this.sourceMapNodeFactories;
    }

    /**
     * @param nodeType
     *
     * @return TwingSourceMapNodeFactory | null
     */
    getSourceMapNodeFactory(nodeType: string) {
        return this.sourceMapNodeFactories.has(nodeType) ? this.sourceMapNodeFactories.get(nodeType) : null;
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
        let constructors = extension.getSourceMapNodeFactories();

        for (let constructor of constructors) {
            this.addSourceMapNodeFactory(constructor);
        }
    }
}
