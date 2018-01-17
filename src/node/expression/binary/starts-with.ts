import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryStartsWith extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return (typeof left === 'string' && typeof right === 'string' && (right.length < 1 || left.startsWith(right)));
    }
}

export default TwingNodeExpressionBinaryStartsWith;