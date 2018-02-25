import {TwingNodeExpressionTest} from "../test";
import {TwingCompiler} from "../../../compiler";

/**
 * Checks if a variable is divisible by a number.
 *
 * <pre>
 *  {% if loop.index is divisible by(3) %}
 * </pre>
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingNodeExpressionTestDivisibleBy extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(0 == ')
            .subcompile(this.getNode('node'))
            .raw(' % ')
            .subcompile(this.getNode('arguments').getNode(0))
            .raw(')')
        ;
    }
}
