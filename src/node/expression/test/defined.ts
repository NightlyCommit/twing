import TwingNodeExpressionTest from "../test";
import TwingNode from "../../../node";
import TwingNodeExpressionGetAttr from "../get-attr";
import TwingNodeExpression from "../../expression";
import TwingNodeExpressionType from "../../expression-type";
import TwingNodeExpressionConstant from "../constant";
import TwingErrorSyntax from "../../../error/syntax";
import TwingTemplate = require("../../../template");
import TwingMap from "../../../map";
import TwingTemplateBlock from "../../../template-block";

/**
 * Checks if a variable is defined in the current context.
 *
 * <pre>
 * {# defined works with variable names and variable attributes #}
 * {% if foo is defined %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 */
class TwingNodeExpressionTestDefined extends TwingNodeExpressionTest {
    constructor(node: TwingNodeExpression, name: string, nodeArguments: TwingNode = null, lineno: number) {
        let changeIgnoreStrictCheck = false;
        let error = null;

        if (node.getExpressionType() === TwingNodeExpressionType.NAME) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getExpressionType() === TwingNodeExpressionType.GET_ATTR) {
            node.setAttribute('is_defined_test', true);
            changeIgnoreStrictCheck = true;
        }
        else if (node.getExpressionType() === TwingNodeExpressionType.BLOCK_REFERENCE) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getExpressionType() === TwingNodeExpressionType.FUNCTION && (node.getAttribute('name') === 'constant')) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getExpressionType() === TwingNodeExpressionType.CONSTANT || node.getExpressionType() === TwingNodeExpressionType.ARRAY) {
            node = new TwingNodeExpressionConstant(true, node.getTemplateLine());
        }
        else {
            error = 'The "defined" test only works with simple variables.';
        }

        super(node, name, nodeArguments, lineno);

        if (changeIgnoreStrictCheck) {
            this.changeIgnoreStrictCheck(node);
        }

        if (error) {
            throw new TwingErrorSyntax(error, this.getTemplateLine());
        }
    }

    changeIgnoreStrictCheck(node: TwingNodeExpressionGetAttr) {
        node.setAttribute('ignore_strict_check', true);

        let exprNode = <TwingNodeExpression>node.getNode('node');

        if (exprNode.expressionType == TwingNodeExpressionType.GET_ATTR) {
            this.changeIgnoreStrictCheck(exprNode);
        }
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        return this.getNode('node').compile(context, template, blocks);
    }
}

export default TwingNodeExpressionTestDefined;