import {TwingNodeExpression} from "./node/expression";
import {TwingNode} from "./node";
import {TwingNodeExpressionTest} from "./node/expression/test";
import {
    TwingCallable,
    TwingCallableArgument,
    TwingCallableWrapper,
    TwingCallableWrapperOptions
} from "./callable-wrapper";

export class TwingTest extends TwingCallableWrapper<boolean> {
    readonly options: TwingCallableWrapperOptions;

    /**
     * Creates a template test.
     *
     * @param {string} name Name of this test
     * @param {TwingCallable<boolean>} callable A callable implementing the test. If null, you need to overwrite the "node_class" option to customize compilation.
     * @param {TwingCallableArgument[]} acceptedArguments
     * @param {TwingCallableWrapperOptions} options Options
     */
    constructor(name: string, callable: TwingCallable<boolean>, acceptedArguments: TwingCallableArgument[], options: TwingCallableWrapperOptions = {}) {
        super(name, callable, acceptedArguments);

        this.options.expression_factory = function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
            return new TwingNodeExpressionTest(node, name, nodeArguments, lineno, columnno);
        };

        this.options = Object.assign({}, this.options, options);
    }
}
