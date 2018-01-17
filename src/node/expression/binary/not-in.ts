import TwingNodeExpressionBinaryIn from "./in";

class TwingNodeExpressionBinaryNotIn extends TwingNodeExpressionBinaryIn {
    execute(value: any, compare: any): any {
        return !super.execute(value, compare);
    }
}

export default TwingNodeExpressionBinaryNotIn;