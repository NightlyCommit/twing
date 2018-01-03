import TwingNodeExpressionConditional from "./conditional";
import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingNodeExpressionBinaryAnd from "./binary/and";
import TwingNodeExpressionUnaryNot from "./unary/not";
import TwingNodeExpressionTestDefined from "./test/defined";
import TwingNodeExpressionTestNull from "./test/null";
import TwingNodeExpressionType from "../expression-type";

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
    //     /*
    //      * This optimizes only one case. PHP 7 also supports more complex expressions
    //      * that can return null. So, for instance, if log is defined, log("foo") ?? "..." works,
    //      * but log($a["foo"]) ?? "..." does not if $a["foo"] is not defined. More advanced
    //      * cases might be implemented as an optimizer node visitor, but has not been done
    //      * as benefits are probably not worth the added complexity.
    //      */
    //     let expr2 = <TwingNodeExpression>this.getNode('expr2');
    //
    //     if (expr2.expressionType == TwingNodeExpressionType.NAME) {
    //         this.getNode('expr2').setAttribute('always_defined', true);
    //
    //         compiler
    //             .raw('((')
    //             .subcompile(this.getNode('expr2'))
    //             .raw(') || (')
    //             .subcompile(this.getNode('expr3'))
    //             .raw('))')
    //         ;
    //     } else {
    //         super.phpCompile(compiler);
    //     }
    // }
}

export default TwingNodeExpressionNullCoalesce;