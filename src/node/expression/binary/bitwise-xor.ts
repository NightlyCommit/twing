import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryBitwiseXor extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('^');
    }
}

export default TwingNodeExpressionBinaryBitwiseXor;