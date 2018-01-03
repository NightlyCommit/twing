import TwingExtension from "../extension";
import TwingTokenParserInterface from "../token-parser-interface";
import TwingFilter from "../filter";
import TwingMap from "../map";
import TwingTest from "../test";
import TwingFunction from "../function";

class TwingExtensionStaging extends TwingExtension {
    private functions: Array<TwingFunction> = [];
    private filters: Array<TwingFilter> = [];
    // private visitors = array();
    private tokenParsers: Map<string, TwingTokenParserInterface> = new Map();
    private tests: Map<string, TwingTest> = new Map();

    // todo: staging extension is conceptually wrong in TwigPHP: it considers this.functions as a hash while other extensions consider it as an array
    addFunction(twingFunction: TwingFunction) {
        this.functions.push(twingFunction);
    }

    getFunctions() {
        return this.functions;
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

    addFilter(filter: TwingFilter) {
        this.filters.push(filter);
    }

    getFilters() {
        return this.filters;
    }

    addTest(name: string, test: TwingTest) {
        this.tests.set(name, test);
    }

    getTests() {
        return this.tests;
    }
}

export default TwingExtensionStaging;