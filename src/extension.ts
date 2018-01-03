import TwingExtensionInterface from "./extension-interface";
import TwingTokenParserInterface from "./token-parser-interface";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingFilter from "./filter";
import TwingTest from "./test";
import TwingFunction from "./function";
import TwingOperatorDefinitionInterface = require("./operator-definition-interface");
import TwingMap from "./map";

class TwingExtension implements TwingExtensionInterface {
    getDefaultStrategy(name: string): string | false {
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

    getTests(): Map<string, TwingTest> {
        return new Map();
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