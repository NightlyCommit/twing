import TwingNodeExpressionBinary = require("../binary");

class TwingNodeExpressionBinaryOr extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left || right;
    }
}

export default TwingNodeExpressionBinaryOr;