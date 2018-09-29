import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryGreater extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('>');
    }
}
