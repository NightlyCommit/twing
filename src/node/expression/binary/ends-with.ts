import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryEndsWith extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return (typeof left === 'string' && typeof right === 'string' && (right.length < 1 || left.endsWith(right)));
    }
}

export default TwingNodeExpressionBinaryEndsWith;