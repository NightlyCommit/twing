import TwingNodeExpressionBinary from "../binary";
import TwingCompiler from "../../../compiler";

const range = require('locutus/php/array/range');

class TwingNodeExpressionBinaryRange extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('Twing.twingRange(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}

export default TwingNodeExpressionBinaryRange;