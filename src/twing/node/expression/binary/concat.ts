import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryConcat extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('+');
    }
}
