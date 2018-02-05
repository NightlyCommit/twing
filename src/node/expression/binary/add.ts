import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryAdd extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('+');
    }
}

export default TwingNodeExpressionBinaryAdd;