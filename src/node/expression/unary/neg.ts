import TwingNodeExpressionUnary from "../unary";

class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
    execute(expr: any): any {
        return -expr;
    }
}

export default TwingNodeExpressionUnaryNeg;