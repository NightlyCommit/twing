import {TwingExtensionInterface} from "./extension-interface";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingTest} from "./test";
import {TwingOperator} from "./operator";
import {TwingSourceMapNodeFactory} from "./source-map/node-factory";

export class TwingExtension implements TwingExtensionInterface {
    TwingExtensionInterfaceImpl: TwingExtensionInterface;

    constructor() {
        this.TwingExtensionInterfaceImpl = this;
    }

    getTokenParsers(): Array<TwingTokenParserInterface> {
        return [];
    }

    getNodeVisitors(): TwingNodeVisitorInterface[] {
        return [];
    }

    getFilters(): TwingFilter[] {
        return [];
    }

    getTests(): TwingTest[] {
        return [];
    }

    getFunctions(): TwingFunction[] {
        return [];
    }

    getOperators(): TwingOperator[] {
        return [];
    }

    getSourceMapNodeFactories(): TwingSourceMapNodeFactory[] {
        return [];
    }
}
