import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryBitwiseOr extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left | right;
    }
}

export default TwingNodeExpressionBinaryBitwiseOr;