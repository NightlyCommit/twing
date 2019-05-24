import {TwingNodeExpressionBinaryDiv} from "./div";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionBinaryFloorDiv extends TwingNodeExpressionBinaryDiv {
    compile(compiler: TwingCompiler) {
        compiler.raw('Math.floor(');
        super.compile(compiler);
        compiler.raw(')');
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('/');
    }
}
