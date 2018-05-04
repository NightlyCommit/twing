import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNode, TwingNodeType} from "../../../node";

export class TwingNodeExpressionBinaryRange extends TwingNodeExpressionBinary {
    constructor(left: TwingNode, right: TwingNode, lineno: number) {
        super(left, right, lineno);

        this.type = TwingNodeType.EXPRESSION_BINARY_RANGE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('Twing.range(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}
