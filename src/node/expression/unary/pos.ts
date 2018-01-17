import TwingNodeExpressionUnary from "../unary";

class TwingNodeExpressionUnaryPos extends TwingNodeExpressionUnary {
    execute(expr: any): any {
        return +expr;
    }
}

export default TwingNodeExpressionUnaryPos;