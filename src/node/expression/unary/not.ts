import TwingNodeExpressionUnary from "../unary";
import TwingNodeExpressionType from "../../expression-type";

class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
    public expressionType = TwingNodeExpressionType.UNARY_NOT;

    execute(expr: any): any {
        return !expr;
    }
}

export = TwingNodeExpressionUnaryNot;