import {TwingNodeExpression} from "./expression";
import {TwingNodeInclude} from "./include";
import {TwingCompiler} from "../compiler";

export class TwingNodeEmbed extends TwingNodeInclude {
    constructor(name: string, index: number, variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean, lineno: number, columnno: number, tag: string) {
        super(null, variables, only, ignoreMissing, lineno, columnno, tag);

        this.setAttribute('name', name);
        this.setAttribute('index', index);
    }

    protected addGetTemplate(compiler: TwingCompiler) {
        compiler
            .raw('await this.loadTemplate(')
            .string(this.getAttribute('name'))
            .raw(', ')
            .repr(this.getTemplateLine())
            .raw(', ')
            .string(this.getAttribute('index'))
            .raw(')')
        ;
    }
}
