import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryGreaterEqual extends TwingNodeExpressionBinary {
    execute(left: any, right: any) {
        return left >= right;
    }
}

export default TwingNodeExpressionBinaryGreaterEqual;