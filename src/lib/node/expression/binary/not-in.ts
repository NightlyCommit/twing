import {TwingCompiler} from "../../../compiler";
import {TwingNodeExpressionBinary} from "../binary";

export class TwingNodeExpressionBinaryNotIn extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('!this.isIn(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}
