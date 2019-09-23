import {TwingNodeExpression} from "./node/expression";
import {TwingNode} from "./node";
import {TwingNodeExpressionTest} from "./node/expression/test";
import {TwingCallableWrapper, TwingCallableWrapperOptions} from "./callable-wrapper";

const merge = require('merge');

type TwingTestCallable = (...args: any[]) => boolean;

export class TwingTest extends TwingCallableWrapper {
    readonly options: TwingCallableWrapperOptions;

    /**
     * Creates a template test.
     *
     * @param {string} name Name of this test
     * @param {TwingTestCallable} callable A callable implementing the test. If null, you need to overwrite the "node_class" option to customize compilation.
     * @param {TwingCallableWrapperOptions} options Options
     */
    constructor(name: string, callable: TwingTestCallable = null, options: TwingCallableWrapperOptions = {}) {
        super(name, callable);

        this.options.expression_factory = function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
            return new TwingNodeExpressionTest(node, name, nodeArguments, lineno, columnno);
        };

        this.options = merge(this.options, options);
    }
}
