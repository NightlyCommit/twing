import {TwingNodeExpressionFunction} from "./node/expression/function";
import {TwingNode} from "./node";
import {TwingCallableWrapperOptions, TwingCallableWrapper} from "./callable-wrapper";

const merge = require('merge');

type TwingFunctionCallable = (...args: any[]) => void;

export class TwingFunction extends TwingCallableWrapper {
    readonly options: TwingCallableWrapperOptions;

    /**
     * Creates a template function.
     *
     * @param {string} name Name of this function
     * @param {TwingFunctionCallable} callable A callable implementing the function. If null, you need to overwrite the "expression_factory" option to customize compilation.
     * @param {TwingCallableWrapperOptions} options Options
     */
    constructor(name: string, callable: TwingFunctionCallable = null, options: TwingCallableWrapperOptions = {}) {
        super (name, callable);

        this.options.expression_factory = function (name: string, functionArguments: TwingNode, line: number, columnno: number) {
            return new TwingNodeExpressionFunction(name, functionArguments, line, columnno);
        };

        this.options = merge(this.options, options);
    }
}
