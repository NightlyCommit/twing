import {TwingNodeExpression} from "./node/expression";
import {TwingNode} from "./node";
import {TwingNodeExpressionTest} from "./node/expression/test";
import {TwingCallableWrapper, TwingCallableWrapperOptions} from "./callable-wrapper";

const merge = require('merge');

export type TwingTestOptions = TwingCallableWrapperOptions & {
    node_factory?: Function;
    alternative?: TwingTest;
};

export class TwingTest extends TwingCallableWrapper {
    private options: TwingTestOptions;
    private methodArguments: Array<any> = [];

    /**
     * Creates a template test.
     *
     * @param {string} name Name of this test
     * @param {Function} callable A callable implementing the test. If null, you need to overwrite the "node_class" option to customize compilation.
     * @param {TwingTestOptions} options Options
     */
    constructor(name: string, callable: Function = null, options: TwingTestOptions = {}) {
        super(name, callable);

        this.options = merge({
            is_variadic: false,
            node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                return new TwingNodeExpressionTest(node, name, nodeArguments, lineno, columnno);
            },
            deprecated: false,
            alternative: null,
        }, options);
    }

    getNodeFactory() {
        return this.options.node_factory;
    }

    setArguments(someArguments: Array<any>) {
        this.methodArguments = someArguments;
    }

    getArguments() {
        return this.methodArguments;
    }

    isVariadic() {
        return this.options.is_variadic;
    }

    isDeprecated() {
        return this.options.deprecated ? true : false;
    }

    getDeprecatedVersion() {
        return this.options.deprecated;
    }

    getAlternative() {
        return this.options.alternative;
    }
}
