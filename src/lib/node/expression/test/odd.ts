import {TwingNodeExpressionTest} from "../test";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionTestOdd extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' % 2 == 1')
            .raw(')')
        ;
    }
}
