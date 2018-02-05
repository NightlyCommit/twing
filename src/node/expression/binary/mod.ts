import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryMod extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('%');
    }
}

export default TwingNodeExpressionBinaryMod;