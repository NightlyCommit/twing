import TwingNodeExpressionBinary = require("../binary");

class TwingNodeExpressionBinaryAdd extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left + right;
    }
}

export default TwingNodeExpressionBinaryAdd;