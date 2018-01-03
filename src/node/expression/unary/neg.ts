import TwingNodeExpressionUnary from "../unary";
import TwingNodeExpressionType from "../../expression-type";

class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
    public expressionType = TwingNodeExpressionType.UNARY_NEG;

    execute(expr: any): any {
        return -expr;
    }
}

export = TwingNodeExpressionUnaryNeg;