import TwingNodeExpressionUnary from "../unary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionUnaryPos extends TwingNodeExpressionUnary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('+');
    }
}

export default TwingNodeExpressionUnaryPos;