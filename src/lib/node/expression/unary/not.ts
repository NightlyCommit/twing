import {TwingNodeExpressionUnary} from "../unary";
import {TwingCompiler} from "../../../compiler";

export class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('!');
    }
}
