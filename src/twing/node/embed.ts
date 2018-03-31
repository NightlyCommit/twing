import {TwingNodeExpression} from "./expression";
import {TwingNodeInclude} from "./include";
import {TwingNodeExpressionConstant} from "./expression/constant";
import {TwingCompiler} from "../compiler";

export class TwingNodeEmbed extends TwingNodeInclude {
    // we don't inject the module to avoid node visitors to traverse it twice (as it will be already visited in the main module)
    constructor(name: string, index: string, variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean, lineno: number, tag: string) {
        super(new TwingNodeExpressionConstant('not_used', lineno), variables, only, ignoreMissing, lineno, tag);

        this.setAttribute('name', name);
        this.setAttribute('index', index);
    }

    addGetTemplate(compiler: TwingCompiler) {
        compiler
            .raw('this.loadTemplate(')
            .string(this.getAttribute('name'))
            .raw(', ')
            .repr(this.getTemplateName())
            .raw(', ')
            .repr(this.getTemplateLine())
            .raw(', ')
            .string(this.getAttribute('index'))
            .raw(')')
        ;
    }
}
