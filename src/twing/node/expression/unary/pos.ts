import {TwingNodeExpressionUnary} from "../unary";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";
import {TwingNode} from "../../../node";

export class TwingNodeExpressionUnaryPos extends TwingNodeExpressionUnary {
    constructor(expr: TwingNode, lineno: number) {
        super(expr, lineno);

        this.type = TwingNodeType.EXPRESSION_UNARY_POS;
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('+');
    }
}
