import TwingNodeExpressionTest from "../test";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionTestSameAs extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(' === ')
            .subcompile(this.getNode('arguments').getNode(0))
            .raw(')')
        ;
    }
}

export default TwingNodeExpressionTestSameAs;