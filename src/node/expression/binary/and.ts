import TwingNodeExpressionBinary = require("../binary");

class TwingNodeExpressionBinaryAnd extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left && right;
    }
}

export default TwingNodeExpressionBinaryAnd;