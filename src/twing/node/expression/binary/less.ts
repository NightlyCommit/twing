import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryLess extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('<');
    }
}
