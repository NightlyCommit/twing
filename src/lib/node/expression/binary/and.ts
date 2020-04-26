import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_binary_and');

export class TwingNodeExpressionBinaryAnd extends TwingNodeExpressionBinary {
    get type() {
        return type;
    }

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
