import {TwingNodeExpressionUnary} from "../unary";
import {TwingCompiler} from "../../../compiler";
import {TwingNode, TwingNodeType} from "../../../node";

export class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
    constructor(expr: TwingNode, lineno: number, columno: number) {
        super(expr, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_UNARY_NEG;
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('-');
    }
}
