import {TwingTestOptions} from "./test-options";
import {TwingNodeExpression} from "./node/expression";
import {TwingNode} from "./node";
import {TwingNodeExpressionTest} from "./node/expression/test";

const merge = require('merge');

export class TwingTest {
    private name: string;
    private callable: Function;
    private options: TwingTestOptions;

    /**
     * Creates a template test.
     *
     * @param string        $name     Name of this test
     * @param callable|null $callable A callable implementing the test. If null, you need to overwrite the "node_class" option to customize compilation.
     * @param array         $options  Options array
     */
    constructor(name: string, callable: Function = null, options: TwingTestOptions = {}) {
        this.name = name;
        this.callable = callable;
        this.options = merge({
            is_variadic: false,
            node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                return new TwingNodeExpressionTest(node, name, nodeArguments, lineno);
            },
            deprecated: false,
            alternative: null,
        }, options);
    }

    getName() {
        return this.name;
    }

    /**
     * Returns the callable to execute for this test.
     *
     * @return callable|null
     */
    getCallable() {
        return this.callable;
    }

    getNodeFactory() {
        return this.options.node_factory;
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
