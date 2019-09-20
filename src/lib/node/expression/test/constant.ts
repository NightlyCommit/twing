import {TwingNodeExpressionTest} from "../test";
import {TwingCompiler} from "../../../compiler";

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
export class TwingNodeExpressionTestConstant extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' === this.getConstant(this.env, ')
            .subcompile(this.getNode('arguments').getNode(0))
        ;

        if (this.getNode('arguments').hasNode(1)) {
            compiler
                .raw(', ')
                .subcompile(this.getNode('arguments').getNode(1))
            ;
        }

        compiler
            .raw('))')
        ;
    }
}
