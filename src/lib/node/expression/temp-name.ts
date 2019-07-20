import {TwingNodeExpression} from "../expression";
import {TwingNodeType} from "../../node";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionTempName extends TwingNodeExpression {
    constructor(name: string, declaration: boolean, lineno: number, columno: number) {
        let attributes = new Map();

        attributes.set('name', name);
        attributes.set('declaration', declaration);

        super(new Map(), attributes, lineno, columno);

        this.type = TwingNodeType.EXPRESSION_TEMP_NAME;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw(`${this.getAttribute('declaration') ? 'let ' : ''}$_`)
            .raw(this.getAttribute('name'))
            .raw('_')
        ;
    }
}
