import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNode, TwingNodeType} from "../../../node";

export class TwingNodeExpressionBinaryConcat extends TwingNodeExpressionBinary {
    constructor(left: TwingNode, right: TwingNode, lineno: number, columno: number) {
        super(left, right, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_BINARY_CONCAT;
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('+');
    }
}
