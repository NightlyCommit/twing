import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_binary_greater');

export class TwingNodeExpressionBinaryGreater extends TwingNodeExpressionBinary {
    get type() {
        return type;
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('>');
    }
}
