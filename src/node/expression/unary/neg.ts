import TwingNodeExpressionUnary from "../unary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('-');
    }
}

export default TwingNodeExpressionUnaryNeg;