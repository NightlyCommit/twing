import TwingNodeExpressionUnary from "../unary";

class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
    execute(expr: any): any {
        return !expr;
    }
}

export default TwingNodeExpressionUnaryNot;