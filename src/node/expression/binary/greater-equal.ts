import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryGreaterEqual extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('>=');
    }
}
