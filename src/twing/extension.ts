import {TwingExtensionInterface} from "./extension-interface";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingOperatorDefinitionInterface} from "./operator-definition-interface";
import {TwingTest} from "./test";

export class TwingExtension implements TwingExtensionInterface {
    getDefaultStrategy(name: string): string | Function {
        return 'html';
    }

    getTokenParsers(): Array<TwingTokenParserInterface> {
        return [];
    }

    getNodeVisitors(): TwingNodeVisitorInterface[] {
        return [];
    }

    getFilters(): Map<string | number, TwingFilter> {
        return new Map();
    }

    getTests(): Array<TwingTest> {
        return [];
    }

    getFunctions(): Map<string | number, TwingFunction> {
        return new Map();
    }

    getOperators(): [Map<string, TwingOperatorDefinitionInterface>, Map<string, TwingOperatorDefinitionInterface>] {
        return [new Map(), new Map()];
    }

}
