import {TwingNodeExpressionName} from "./name";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
    constructor(name: string, lineno: number, columnno: number) {
        super(name, lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_ASSIGN_NAME;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .string(this.getAttribute('name'))
        ;
    }
}
