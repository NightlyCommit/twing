import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryMatches extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('this.createRegex(')
            .subcompile(this.getNode('right'))
            .raw(').test(')
            .subcompile(this.getNode('left'))
            .raw(')')
        ;
    }
}
