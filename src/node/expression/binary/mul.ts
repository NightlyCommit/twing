import TwingNodeExpressionBinary = require("../binary");

class TwingNodeExpressionBinaryMul extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left * right;
    }
}

export default TwingNodeExpressionBinaryMul;