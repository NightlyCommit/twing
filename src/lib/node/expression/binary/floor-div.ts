import {TwingNodeExpressionBinaryDiv} from "./div";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_binary_floor_div');

export class TwingNodeExpressionBinaryFloorDiv extends TwingNodeExpressionBinaryDiv {
    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler.raw('Math.floor(');
        super.compile(compiler);
        compiler.raw(')');
    }

    operator(compiler: TwingCompiler) {
        return compiler.raw('/');
    }
}
