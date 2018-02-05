import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryBitwiseOr extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('|');
    }
}

export default TwingNodeExpressionBinaryBitwiseOr;