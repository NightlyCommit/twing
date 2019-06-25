import {TwingExtensionInterface} from "./extension-interface";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingTest} from "./test";
import {TwingSourceMapNodeConstructor} from "./source-map/node";
import {TwingNodeType} from "./node";
import {TwingOperator} from "./operator";

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

    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor> {
        return new Map();
    }
}
