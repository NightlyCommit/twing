import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryConcat extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('+');
    }
}

export default TwingNodeExpressionBinaryConcat;