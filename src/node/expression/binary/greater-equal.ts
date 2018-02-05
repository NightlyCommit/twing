import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryGreaterEqual extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('>=');
    }
}

export default TwingNodeExpressionBinaryGreaterEqual;