import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryBitwiseAnd extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('&');
    }
}

export default TwingNodeExpressionBinaryBitwiseAnd;