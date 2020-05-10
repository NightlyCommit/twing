import {TwingNodeExpressionFilter} from "../filter";
import {TwingNode} from "../../../node";
import {TwingNodeExpressionConstant} from "../constant";
import {TwingNodeExpressionTestDefined} from "../test/defined";
import {TwingNodeExpressionConditional} from "../conditional";
import {TwingNodeExpression} from "../../expression";
import {TwingCompiler} from "../../../compiler";
import {type as nameType} from "../name";
import {type as getAttrType} from "../get-attribute";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_filter');

export class TwingNodeExpressionFilterDefault extends TwingNodeExpressionFilter {
    constructor(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let defaultNode = new TwingNodeExpressionFilter(node, new TwingNodeExpressionConstant('default', node.getTemplateLine(), node.getTemplateColumn()), methodArguments, node.getTemplateLine(), node.getTemplateColumn());

        if (filterName.getAttribute('value') === 'default' && (node.is(nameType) || node.is(getAttrType))) {
            let test = new TwingNodeExpressionTestDefined(node.clone() as TwingNodeExpression, 'defined', new TwingNode(), node.getTemplateLine(), node.getTemplateColumn());
            let falseNode = methodArguments.getNodes().size ? methodArguments.getNode(0) : new TwingNodeExpressionConstant('', node.getTemplateLine(), node.getTemplateColumn());

            node = new TwingNodeExpressionConditional(test, defaultNode, falseNode as TwingNodeExpression, node.getTemplateLine(), node.getTemplateColumn());
        }
        else {
            node = defaultNode;
        }

        super(node, filterName, methodArguments, lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('node'));
    }
}
