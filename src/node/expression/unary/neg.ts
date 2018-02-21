import TwingNodeExpressionUnary from "../unary";
import TwingCompiler from "../../../compiler";
import TwingNode from "../../../node";
import TwingNodeType from "../../../node-type";

class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
    constructor(expr: TwingNode, lineno: number) {
        super(expr, lineno);

        this.type = TwingNodeType.EXPRESSION_UNARY_NEG;
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('-');
    }
}

export default TwingNodeExpressionUnaryNeg;