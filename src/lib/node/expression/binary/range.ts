import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNode, TwingNodeType} from "../../../node";

export class TwingNodeExpressionBinaryRange extends TwingNodeExpressionBinary {
    constructor(nodes: [TwingNode, TwingNode], lineno: number, columno: number) {
        super(nodes, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_BINARY_RANGE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('this.createRange(')
            .subcompile(this.getNode('left'))
            .raw(', ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }
}
