import TwingNodeExpressionConditional from "./conditional";
import TwingNodeExpression from "../expression";
import TwingNodeExpressionTestDefined from "./test/defined";
import TwingNodeExpressionUnaryNot from "./unary/not";
import TwingNodeExpressionTestNull from "./test/null";
import TwingNode from "../../node";
import TwingNodeExpressionBinaryAnd from "./binary/and";
import TwingCompiler from "../../compiler";
import TwingNodeExpressionName from "./name";

class TwingNodeExpressionNullCoalesce extends TwingNodeExpressionConditional {
    constructor(left: TwingNodeExpression, right: TwingNodeExpression, lineno: number) {
        let test = new TwingNodeExpressionBinaryAnd(
            new TwingNodeExpressionTestDefined(<TwingNodeExpression>left.clone(), 'defined', new TwingNode(), left.getTemplateLine()),
            new TwingNodeExpressionUnaryNot(new TwingNodeExpressionTestNull(left, 'null', new TwingNode(), left.getTemplateLine()), left.getTemplateLine()),
            left.getTemplateLine()
        );

        super(test, left, right, lineno);
    }

    // compile(compiler: TwingCompiler) {
    //     if (this.getNode('expr2') instanceof TwingNodeExpressionName) {
    //         this.getNode('expr2').setAttribute('always_defined', true);
    //     }
    //
    //     return super.compile(compiler);
    // }
}

export default TwingNodeExpressionNullCoalesce;