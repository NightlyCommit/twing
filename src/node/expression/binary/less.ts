import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryLess extends TwingNodeExpressionBinary {
    execute(left: any, right: any) {
        return left < right;
    }
}

export default TwingNodeExpressionBinaryLess;