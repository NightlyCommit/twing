import TwingCompiler from "../../../compiler";
import TwingNodeExpressionBinary from "../binary";

class TwingNodeExpressionBinaryNotIn extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('!Twing.twingInFilter(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}

export default TwingNodeExpressionBinaryNotIn;