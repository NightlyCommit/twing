import TwingTest from "../test";
import TwingNodeExpression from "../node/expression";
import TwingNode from "../node";
import TwingNodeExpressionTestDefined from "../node/expression/test/defined";

class TwingTestDefined extends TwingTest {
    getNodeFactory(): Function {
        return function(node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
            return new TwingNodeExpressionTestDefined(node, name, nodeArguments, lineno);
        };
    }
}

export = TwingTestDefined;