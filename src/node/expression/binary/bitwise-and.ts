import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryBitwiseAnd extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left & right;
    }
}

export default TwingNodeExpressionBinaryBitwiseAnd;