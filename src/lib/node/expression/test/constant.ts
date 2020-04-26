import {TwingNodeExpressionTest} from "../test";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_test_constant');

export class TwingNodeExpressionTestConstant extends TwingNodeExpressionTest {
    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' === this.constant(this.env, ')
            .subcompile(this.getNode('arguments').getNode(0));

        if (this.getNode('arguments').hasNode(1)) {
            compiler
                .raw(', ')
                .subcompile(this.getNode('arguments').getNode(1));
        }

        compiler.raw('))');
    }
}
