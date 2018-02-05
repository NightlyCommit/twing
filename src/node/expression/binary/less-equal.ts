import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryLessEqual extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('<=');
    }
}

export default TwingNodeExpressionBinaryLessEqual;