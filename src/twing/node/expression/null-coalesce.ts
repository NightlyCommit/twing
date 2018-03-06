import {TwingNodeExpressionConditional} from "./conditional";
import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionTestDefined} from "./test/defined";
import {TwingNodeExpressionUnaryNot} from "./unary/not";
import {TwingNodeExpressionTestNull} from "./test/null";
import {TwingNode, TwingNodeType} from "../../node";
import {TwingNodeExpressionBinaryAnd} from "./binary/and";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionNullCoalesce extends TwingNodeExpressionConditional {
    constructor(left: TwingNodeExpression, right: TwingNodeExpression, lineno: number) {
        let test = new TwingNodeExpressionBinaryAnd(
            new TwingNodeExpressionTestDefined(<TwingNodeExpression>left.clone(), 'defined', new TwingNode(), left.getTemplateLine()),
            new TwingNodeExpressionUnaryNot(new TwingNodeExpressionTestNull(left, 'null', new TwingNode(), left.getTemplateLine()), left.getTemplateLine()),
            left.getTemplateLine()
        );

        super(test, left, right, lineno);

        this.type = TwingNodeType.EXPRESSION_NULL_COALESCE;
    }

    compile(compiler: TwingCompiler) {
        if (this.getNode('expr2').getType() === TwingNodeType.EXPRESSION_NAME) {
            this.getNode('expr2').setAttribute('always_defined', true);
        }

        return super.compile(compiler);
    }
}
