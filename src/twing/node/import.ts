/**
 * Represents an import node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import {TwingNode} from "../node";
import {TwingNodeExpression} from "./expression";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export class TwingNodeImport extends TwingNode {
    constructor(expr: TwingNodeExpression, varName: TwingNodeExpression, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);
        nodes.set('var', varName);

        super(nodes, new TwingMap(), lineno, tag);

        this.type = TwingNodeType.IMPORT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('')
            .subcompile(this.getNode('var'))
            .raw(' = ')
        ;

        if (this.getNode('expr').getType() === TwingNodeType.EXPRESSION_NAME && this.getNode('expr').getAttribute('name') === '_self') {
            compiler.raw('this');
        }
        else {
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
