import {TwingNodeExpressionFilter} from "./node/expression/filter";
import {TwingNode} from "./node";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingCallableWrapperOptions, TwingCallableWrapper, TwingCallableArgument} from "./callable-wrapper";

type TwingFilterCallable = (...args: any[]) => any;

export type TwingFilterOptions = TwingCallableWrapperOptions & {
    pre_escape?: string,
    preserves_safety?: Array<string>
}

export class TwingFilter extends TwingCallableWrapper {
    readonly options: TwingFilterOptions;

    constructor(name: string, callable: TwingFilterCallable, acceptedArguments: TwingCallableArgument[], options: TwingFilterOptions = {}) {
        super(name, callable, acceptedArguments);

        this.options.pre_escape = null;
        this.options.preserves_safety = null;
        this.options.expression_factory = function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, columnno: number, tag: string = null) {
            return new TwingNodeExpressionFilter(node, filterName, methodArguments, lineno, columnno, tag);
        };

        this.options = Object.assign({}, this.options, options);
    }

    getPreservesSafety() {
        return this.options.preserves_safety;
    }

    getPreEscape() {
        return this.options.pre_escape;
    }
}
