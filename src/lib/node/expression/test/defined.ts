import {TwingNodeExpressionTest} from "../test";
import {TwingNode, TwingNodeType} from "../../../node";
import {TwingNodeExpression} from "../../expression";
import {TwingNodeExpressionConstant} from "../constant";
import {TwingErrorSyntax} from "../../../error/syntax";
import {TwingCompiler} from "../../../compiler";

/**
 * Checks if a variable is defined in the active context.
 *
 * <pre>
 * {# defined works with variable names and variable attributes #}
 * {% if foo is defined %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 */
export class TwingNodeExpressionTestDefined extends TwingNodeExpressionTest {
    constructor(node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
        let changeIgnoreStrictCheck = false;
        let error = null;

        if (node.getType() === TwingNodeType.EXPRESSION_NAME) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_GET_ATTR) {
            node.setAttribute('is_defined_test', true);
            changeIgnoreStrictCheck = true;
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_BLOCK_REFERENCE) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_FUNCTION && (node.getAttribute('name') === 'constant')) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_CONSTANT || node.getType() === TwingNodeType.EXPRESSION_ARRAY) {
            node = new TwingNodeExpressionConstant(true, node.getTemplateLine(), node.getTemplateColumn());
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_METHOD_CALL) {
            node.setAttribute('is_defined_test', true);
        }
        else {
            error = 'The "defined" test only works with simple variables.';
        }

        super(node, name, nodeArguments, lineno, columnno);

        if (changeIgnoreStrictCheck) {
            this.changeIgnoreStrictCheck(node);
        }

        if (error) {
            throw new TwingErrorSyntax(error, this.getTemplateLine());
        }
    }

    changeIgnoreStrictCheck(node: TwingNodeExpression) {
        node.setAttribute('optimizable', false);
        node.setAttribute('ignore_strict_check', true);

        let exprNode = <TwingNodeExpression>node.getNode('node');

        if (exprNode.getType() === TwingNodeType.EXPRESSION_GET_ATTR) {
            this.changeIgnoreStrictCheck(exprNode);
        }
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('node'));
    }
}
