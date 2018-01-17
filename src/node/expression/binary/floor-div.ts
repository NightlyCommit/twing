import TwingNodeExpressionBinary from "../binary";
import TwingNodeExpressionBinaryDiv from "./div";

class TwingNodeExpressionBinaryFloorDiv extends TwingNodeExpressionBinaryDiv {
    execute(left: any, right: any): any {
        return Math.floor(super.execute(left, right));
    }
}

export default TwingNodeExpressionBinaryFloorDiv;