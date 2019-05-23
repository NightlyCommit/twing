import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNode, TwingNodeType} from "../../../node";

export class TwingNodeExpressionBinaryRange extends TwingNodeExpressionBinary {
    constructor(left: TwingNode, right: TwingNode, lineno: number, columno: number) {
        super(left, right, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_BINARY_RANGE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('Runtime.range(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}
