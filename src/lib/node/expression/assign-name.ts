import {TwingNodeExpressionName} from "./name";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_assign_name');

export class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('context.proxy[')
            .string(this.getAttribute('name'))
            .raw(']')
        ;
    }
}
