import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

class TwingNodeExpressionBinaryEndsWith extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('(() => {')
            .raw(`let left = `)
            .subcompile(this.getNode('left'))
            .raw('; ')
            .raw(`let right = `)
            .subcompile(this.getNode('right'))
            .raw('; ')
            .raw(`return typeof left === 'string' && typeof right === 'string' && (right.length < 1 || left.endsWith(right));`)
            .raw('})()')
        ;
    }
}

export default TwingNodeExpressionBinaryEndsWith;