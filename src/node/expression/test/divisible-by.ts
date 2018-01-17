import TwingNodeExpressionTest from "../test";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";

/**
 * Checks if a variable is divisible by a number.
 *
 * <pre>
 *  {% if loop.index is divisible by(3) %}
 * </pre>
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingNodeExpressionTestDivisibleBy extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let leftHandler = compiler.subcompile(this.getNode('node'));
        let rightHandler = compiler.subcompile(this.getNode('arguments').getNode(0));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return leftHandler(template, context, blocks) % rightHandler(template, context, blocks) === 0;
        }
    }
}

export default TwingNodeExpressionTestDivisibleBy;