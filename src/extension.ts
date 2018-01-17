import TwingExtensionInterface from "./extension-interface";
import TwingTokenParserInterface from "./token-parser-interface";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingFilter from "./filter";
import TwingFunction from "./function";
import TwingOperatorDefinitionInterface from "./operator-definition-interface";
import TwingTest from "./test";

class TwingExtension implements TwingExtensionInterface {
    getDefaultStrategy(name: string): string | Function {
        return 'html';
    }

    getTokenParsers(): Array<TwingTokenParserInterface> {
        return [];
    }

    getNodeVisitors(): TwingNodeVisitorInterface[] {
        return [];
    }

    getFilters(): Array<TwingFilter> {
        return [];
    }

    getTests(): Array<TwingTest> {
        return [];
    }

    getFunctions(): Array<TwingFunction> {
        return [];
    }

    getOperators(): { unary: Map<string, TwingOperatorDefinitionInterface>, binary: Map<string, TwingOperatorDefinitionInterface> } {
        return {
            unary: new Map(),
            binary: new Map()
        };
    }

}

export default TwingExtension;