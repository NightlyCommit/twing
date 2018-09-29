import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryBitwiseOr extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('|');
    }
}
