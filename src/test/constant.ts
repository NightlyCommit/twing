import TwingTest from "../test";
import TwingNodeExpression from "../node/expression";
import TwingNode from "../node";
import TwingNodeExpressionTestConstant from "../node/expression/test/constant";

class TwingTestConstant extends TwingTest {
    getNodeFactory(): Function {
        return function(node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
            return new TwingNodeExpressionTestConstant(node, name, nodeArguments, lineno);
        };
    }
}

export = TwingTestConstant;