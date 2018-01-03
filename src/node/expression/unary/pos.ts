import TwingNodeExpressionUnary from "../unary";
import TwingNodeExpressionType from "../../expression-type";

class TwingNodeExpressionUnaryPos extends TwingNodeExpressionUnary {
    public expressionType = TwingNodeExpressionType.UNARY_POS;

    execute(expr: any): any {
        return +expr;
    }
}

export = TwingNodeExpressionUnaryPos;