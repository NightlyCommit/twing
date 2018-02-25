import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryLessEqual extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('<=');
    }
}
