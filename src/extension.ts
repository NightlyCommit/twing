import {TwingExtensionInterface} from "./extension-interface";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingTest} from "./test";
import {TwingSourceMapNodeConstructor} from "./source-map/node";
import {TwingNodeType} from "./node";

export type TwingOperator = {
    precedence: number,
    associativity?: string,
    factory: Function,
    callable?: Function;
}

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

    getOperators(): [Map<string, TwingOperator>, Map<string, TwingOperator>] {
        return [new Map(), new Map()];
    }

    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor> {
        return new Map();
    }
}
