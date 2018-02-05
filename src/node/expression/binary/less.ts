import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryLess extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('<');
    }
}

export default TwingNodeExpressionBinaryLess;