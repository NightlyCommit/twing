import {TwingExtension} from "../extension";
import {TwingTokenParserInterface} from "../token-parser-interface";
import {TwingFilter} from "../filter";
import {TwingFunction} from "../function";
import {TwingTest} from "../test";
import {TwingNodeVisitorInterface} from "../node-visitor-interface";

export class TwingExtensionStaging extends TwingExtension {
    private functions: Map<string, TwingFunction> = new Map();
    private filters: Map<string, TwingFilter> = new Map();
    private visitors: Array<TwingNodeVisitorInterface> = [];
    private tokenParsers: Map<string, TwingTokenParserInterface> = new Map();
    private tests: Array<TwingTest> = [];

    addFunction(twingFunction: TwingFunction) {
        if (this.functions.has(twingFunction.getName())) {
            throw new Error(`Function "${twingFunction.getName()}" is already registered.`);
        }

        this.functions.set(twingFunction.getName(), twingFunction);
    }

    getFunctions() {
        return this.functions;
    }

    addFilter(filter: TwingFilter) {
       if (this.filters.has(filter.getName())) {
           throw new Error(`Filter "${filter.getName()}" is already registered.`);
       }

       this.filters.set(filter.getName(), filter);
    }

    getFilters() {
        return this.filters;
    }

    addNodeVisitor(visitor: TwingNodeVisitorInterface) {
        this.visitors.push(visitor);
    }

    getNodeVisitors() {
        return this.visitors;
    }

    addTokenParser(parser: TwingTokenParserInterface) {
        if (this.tokenParsers.has(parser.getTag())) {
            throw new Error(`Tag "${parser.getTag()}" is already registered.`);
        }

        this.tokenParsers.set(parser.getTag(), parser);
    }

    getTokenParsers(): Array<TwingTokenParserInterface> {
        return Array.from(this.tokenParsers.values());
    }

    addTest(test: TwingTest) {
        this.tests.push(test);
    }

    getTests() {
        return this.tests;
    }
}
