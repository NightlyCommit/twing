import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryPower extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('Math.pow(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}
