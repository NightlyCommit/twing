import TwingNodeExpressionTest from "../test";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionTestNull extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' === null)')
        ;
    }
}

export default TwingNodeExpressionTestNull;