import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinarySub extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('-');
    }
}

export default TwingNodeExpressionBinarySub;