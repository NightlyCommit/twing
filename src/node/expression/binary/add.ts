import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryAdd extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left + right;
    }
}

export default TwingNodeExpressionBinaryAdd;