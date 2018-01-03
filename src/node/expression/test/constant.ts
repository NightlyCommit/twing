import TwingNodeExpressionTest from "../test";
import TwingTemplate = require("../../../template");

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
    compile(context: any, template: TwingTemplate) {
        let env = template.getEnvironment();
        let globals: any = env.getGlobals();

        let actual: any = this.getNode('node').compile(context, template);
        let key: string = this.getNode('arguments').getNode(0).compile(context, template);
        let expected: any;

        if (this.getNode('arguments').hasNode(1)) {
            let object = this.getNode('arguments').getNode(1).compile(context, template);

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

export default TwingNodeExpressionTestConstant;