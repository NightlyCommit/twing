import TwingNodeExpressionTest from "../test";
import TwingNode from "../../../node";
import TwingNodeExpressionGetAttr from "../get-attr";
import TwingNodeExpression from "../../expression";
import TwingNodeExpressionConstant from "../constant";
import TwingErrorSyntax from "../../../error/syntax";
import TwingNodeExpressionName from "../name";
import TwingNodeExpressionBlockReference from "../block-reference";
import TwingNodeExpressionFunction from "../function";
import TwingNodeExpressionArray from "../array";
import TwingCompiler from "../../../compiler";

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
class TwingNodeExpressionTestDefined extends TwingNodeExpressionTest {
    constructor(node: TwingNodeExpression, name: string, nodeArguments: TwingNode = null, lineno: number) {
        let changeIgnoreStrictCheck = false;
        let error = null;

        // @see https://github.com/Microsoft/TypeScript/issues/10422
        if (node as any instanceof TwingNodeExpressionName) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node as any instanceof TwingNodeExpressionGetAttr) {
            node.setAttribute('is_defined_test', true);
            changeIgnoreStrictCheck = true;
        }
        else if (node as any instanceof TwingNodeExpressionBlockReference) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node as any instanceof TwingNodeExpressionFunction && (node.getAttribute('name') === 'constant')) {
            node.setAttribute('is_defined_test', true);
        }
        else if (node as any instanceof TwingNodeExpressionConstant || node as any instanceof TwingNodeExpressionArray) {
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

    changeIgnoreStrictCheck(node: TwingNodeExpression) {
        node.setAttribute('ignore_strict_check', true);

        let exprNode = <TwingNodeExpression>node.getNode('node');

        if (exprNode instanceof TwingNodeExpressionGetAttr) {
            this.changeIgnoreStrictCheck(exprNode);
        }
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('node'));
    }
}

export default TwingNodeExpressionTestDefined;