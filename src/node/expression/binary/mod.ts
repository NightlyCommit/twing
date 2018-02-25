import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryMod extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('%');
    }
}
