import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryBitwiseXor extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('^');
    }
}
