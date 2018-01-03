import TwingTest from "../test";
import TwingNodeExpression from "../node/expression";
import TwingNode from "../node";
import TwingNodeExpressionTestDefined from "../node/expression/test/defined";
import TwingNodeExpressionTestOdd = require("../node/expression/test/odd");

class TwingTestOdd extends TwingTest {
    getNodeFactory(): Function {
        return function(node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
            return new TwingNodeExpressionTestOdd(node, name, nodeArguments, lineno);
        };
    }
}

export = TwingTestOdd;