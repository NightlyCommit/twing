import TwingNodeExpressionUnary from "../unary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('!');
    }
}

export default TwingNodeExpressionUnaryNot;