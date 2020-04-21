import {TwingNodeExpressionUnary} from "../unary";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_unary_not');

export class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
    get type() {
        return type;
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('!');
    }
}
