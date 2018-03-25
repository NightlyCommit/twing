import {TwingExtensionInterface} from "./extension-interface";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingFilter} from "./filter";
import {TwingFunction} from "./function";
import {TwingTest} from "./test";

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

    getFilters(): Map<string | number, TwingFilter> {
        return new Map();
    }

    getTests(): Array<TwingTest> {
        return [];
    }

    getFunctions(): Map<string | number, TwingFunction> {
        return new Map();
    }

    getOperators(): [Map<string, TwingOperator>, Map<string, TwingOperator>] {
        return [new Map(), new Map()];
    }
}
