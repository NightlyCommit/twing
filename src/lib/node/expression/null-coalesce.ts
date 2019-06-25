import {TwingNodeExpressionConditional} from "./conditional";
import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionTestDefined} from "./test/defined";
import {TwingNodeExpressionUnaryNot} from "./unary/not";
import {TwingNode, TwingNodeType} from "../../node";
import {TwingNodeExpressionBinaryAnd} from "./binary/and";
import {TwingCompiler} from "../../compiler";
import {TwingNodeExpressionTest} from "./test";

export class TwingNodeExpressionNullCoalesce extends TwingNodeExpressionConditional {
    constructor(nodes: [TwingNode, TwingNode], lineno: number, columno: number) {
        let left = nodes[0];
        let right = nodes[1];

        let test = new TwingNodeExpressionBinaryAnd(
            [
                new TwingNodeExpressionTestDefined(<TwingNodeExpression>left.clone(), 'defined', new TwingNode(), left.getTemplateLine(), left.getTemplateColumn()),
                new TwingNodeExpressionUnaryNot(
                    new TwingNodeExpressionTest(left, 'null', new TwingNode(), left.getTemplateLine(), left.getTemplateColumn()),
                    left.getTemplateLine(),
                    left.getTemplateColumn()
                )
            ],
            left.getTemplateLine(),
            left.getTemplateColumn()
        );

        super(test, left, right, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_NULL_COALESCE;
    }

    compile(compiler: TwingCompiler) {
        if (this.getNode('expr2').getType() === TwingNodeType.EXPRESSION_NAME) {
            this.getNode('expr2').setAttribute('always_defined', true);
        }

        return super.compile(compiler);
    }
}
