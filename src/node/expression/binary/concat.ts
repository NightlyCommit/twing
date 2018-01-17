import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryConcat extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return ('' + left) + ('' + right);
    }
}

export default TwingNodeExpressionBinaryConcat;