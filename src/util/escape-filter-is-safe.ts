import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNode from "../node";

export default function twingEscapeFilterIsSafe(filterArgs: TwingNode) {
    if (filterArgs.getNodes().size > 0) {
        let result: Array<string> = [];

        filterArgs.getNodes().forEach(function(arg) {
            if (arg instanceof TwingNodeExpressionConstant) {
                result = [arg.getAttribute('value')];
            }
        });

        return result;
    }
    else {
        return ['html'];
    }
}