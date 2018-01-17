import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryBitwiseXor extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return left ^ right;
    }
}

export default TwingNodeExpressionBinaryBitwiseXor;