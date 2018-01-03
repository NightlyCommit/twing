import TwingNodeExpressionBinary = require("../binary");

class TwingNodeExpressionBinaryGreater extends TwingNodeExpressionBinary {
    execute(left: any, right: any) {
        return left > right;
    }
}

export = TwingNodeExpressionBinaryGreater;