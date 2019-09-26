/**
 * Represents an import node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";

import {TwingCompiler} from "../compiler";

export class TwingNodeImport extends TwingNode {
    constructor(expr: TwingNodeExpression, varName: TwingNodeExpression, lineno: number, columnno: number, tag: string = null, global: boolean = true) {
        let nodes = new Map();

        nodes.set('expr', expr);
        nodes.set('var', varName);

        let attributes = new Map();

        attributes.set('global', global);

        super(nodes, attributes, lineno, columnno, tag);

        this.type = TwingNodeType.IMPORT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write('macros.proxy[')
            .repr(this.getNode('var').getAttribute('name'))
            .raw('] = ')
        ;

        if (this.getAttribute('global')) {
            compiler
                .raw('this.macros.proxy[')
                .repr(this.getNode('var').getAttribute('name'))
                .raw('] = ')
            ;
        }

        if (this.getNode('expr').getType() === TwingNodeType.EXPRESSION_NAME && this.getNode('expr').getAttribute('name') === '_self') {
            compiler.raw('this');
        } else {
            compiler
                .raw('this.loadTemplate(')
                .subcompile(this.getNode('expr'))
                .raw(', ')
                .repr(this.getTemplateName())
                .raw(', ')
                .repr(this.getTemplateLine())
                .raw(')')
            ;
        }

        compiler.raw(";\n");
    }
}
