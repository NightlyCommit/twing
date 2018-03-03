import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryAnd extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('!!')
        ;

        super.compile(compiler);
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('&&');
    }
}
