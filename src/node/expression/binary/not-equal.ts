import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryNotEqual extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('!=');
    }
}

export default TwingNodeExpressionBinaryNotEqual;