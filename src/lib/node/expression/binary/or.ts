import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryOr extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('!!')
        ;

        super.compile(compiler);
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('||');
    }
}
