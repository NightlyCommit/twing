import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinarySub extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('-');
    }
}
