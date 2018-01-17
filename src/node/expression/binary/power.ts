import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryPower extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return Math.pow(left, right);
    }
}

export default TwingNodeExpressionBinaryPower;