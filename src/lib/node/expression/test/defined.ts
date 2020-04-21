import {TwingNodeExpressionTest} from "../test";
import {TwingNode} from "../../../node";
import {TwingNodeExpression} from "../../expression";
import {TwingNodeExpressionConstant, type as constantType} from "../constant";
import {type as nameType} from "../name";
import {type as getAttrType} from "../get-attr";
import {type as blockreferenceType} from "../block-reference";
import {type as functionType} from "../function";
import {type as arrayType} from "../array";
import {type as methodCallType} from "../method-call";
import {TwingErrorSyntax} from "../../../error/syntax";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_test_defined');

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

        if (node.is(nameType)) {
            node.setAttribute('is_defined_test', true);
        } else if (node.is(getAttrType)) {
            node.setAttribute('is_defined_test', true);
            changeIgnoreStrictCheck = true;
        } else if (node.is(blockreferenceType)) {
            node.setAttribute('is_defined_test', true);
        } else if (node.is(functionType) && (node.getAttribute('name') === 'constant')) {
            node.setAttribute('is_defined_test', true);
        } else if (node.is(constantType) || node.is(arrayType)) {
            node = new TwingNodeExpressionConstant(true, node.getTemplateLine(), node.getTemplateColumn());
        } else if (node.is(methodCallType)) {
            node.setAttribute('is_defined_test', true);
        } else {
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

    get type() {
        return type;
    }

    changeIgnoreStrictCheck(node: TwingNodeExpression) {
        node.setAttribute('optimizable', false);
        node.setAttribute('ignore_strict_check', true);

        let exprNode = <TwingNodeExpression>node.getNode('node');

        if (exprNode.is(getAttrType)) {
            this.changeIgnoreStrictCheck(exprNode);
        }
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('node'));
    }
}
