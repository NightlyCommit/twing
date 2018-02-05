import TwingNodeExpressionBinaryIn from "./in";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryNotIn extends TwingNodeExpressionBinaryIn {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('!Twing.twingInFilter(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('not in');
    }
}

export default TwingNodeExpressionBinaryNotIn;