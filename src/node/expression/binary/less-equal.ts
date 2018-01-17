import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryLessEqual extends TwingNodeExpressionBinary {
    execute(left: any, right: any) {
        return left <= right;
    }
}

export default TwingNodeExpressionBinaryLessEqual;