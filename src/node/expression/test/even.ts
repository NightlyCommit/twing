import {TwingNodeExpressionTest} from "../test";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionTestEven extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' % 2 == 0')
            .raw(')')
        ;
    }
}
