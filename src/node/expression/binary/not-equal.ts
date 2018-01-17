import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryNotEqual extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left != right;
    }
}

export default TwingNodeExpressionBinaryNotEqual;