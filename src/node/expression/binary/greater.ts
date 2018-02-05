import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryGreater extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('>');
    }
}

export default TwingNodeExpressionBinaryGreater;