import TwingNodeExpressionTest from "../test";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionTestNull extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(null === ')
            .subcompile(this.getNode('node'))
            .raw(')')
        ;
    }
}

export default TwingNodeExpressionTestNull;