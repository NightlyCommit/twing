import {TwingNodeExpressionBinary} from "../binary";
import {TwingCompiler} from "../../../compiler";
import {TwingNodeType} from "../../../node-type";

export const type = new TwingNodeType('expression_binary_div');

export class TwingNodeExpressionBinaryDiv extends TwingNodeExpressionBinary {
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler.raw('/');
    }

    get type(): TwingNodeType {
        return type;
    }
}
