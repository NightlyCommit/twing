import {TwingNodeExpression} from "../expression";

import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionParent extends TwingNodeExpression {
    constructor(name: string, lineno: number) {
        let attributes = new Map();

        attributes.set('output', false);
        attributes.set('name', name);

        super(new Map(), attributes, lineno);

        this.type = TwingNodeType.EXPRESSION_PARENT;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');

        compiler
            .raw(`await this.traceableRenderParentBlock(${this.getTemplateLine()}, this.getSourceContext())(`)
            .string(name)
            .raw(', context, blocks)')
        ;
    }
}
