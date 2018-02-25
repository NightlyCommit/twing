import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryBitwiseAnd extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler) {
        return compiler.raw('&');
    }
}
