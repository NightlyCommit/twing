import TwingNode from "../node";
import TwingNodeExpressionType from "./expression-type";

abstract class TwingNodeExpression extends TwingNode {
    public expressionType: TwingNodeExpressionType = TwingNodeExpressionType.NONE;

    getExpressionType(): TwingNodeExpressionType {
        return this.expressionType;
    }
}

export default TwingNodeExpression;