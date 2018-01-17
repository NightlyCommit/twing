import TwingNodeExpressionTest from "../test";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";

/**
 * Checks if a variable is the exact same value as a constant.
 *
 * <pre>
 *  {% if post.status is constant('Post::PUBLISHED') %}
 *    the status attribute is exactly the same as Post::PUBLISHED
 *  {% endif %}
 * </pre>
 *
 * Global or class constants make no sense in JavaScript. To emulate the expected behavior, it is assumed that
 * so-called constants are keys of the TwingEnvironment::globals property.
 */
class TwingNodeExpressionTestConstant extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let env = compiler.getEnvironment();
        let globals: any = env.getGlobals();
        let actualHandler: any = compiler.subcompile(this.getNode('node'));
        let keyHandler: any = compiler.subcompile(this.getNode('arguments').getNode(0));
        let objectHandler: DoDisplayHandler;

        if (this.getNode('arguments').hasNode(1)) {
            objectHandler = compiler.subcompile(this.getNode('arguments').getNode(1));
        }

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            let actual = actualHandler(template, context, blocks);
            let key = keyHandler(template, context, blocks);
            let expected: any;

            if (objectHandler) {
                let object = objectHandler(template, context, blocks);

                if (object && typeof object === 'object') {
                    let className = object.constructor.name;

                    expected = globals[className][key];
                }
            }
            else {
                expected = globals[key];
            }

            return actual === expected;
        }
    }
}

export default TwingNodeExpressionTestConstant;