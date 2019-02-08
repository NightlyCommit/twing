/**
 * Represents a deprecated node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";
import {TwingCompiler} from "../compiler";

export class TwingNodeDeprecated extends TwingNode {
    constructor(expr: TwingNodeExpression, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['expr', expr]]), new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.DEPRECATED;
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);

        let expr = this.getNode('expr');

        if (expr.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
            compiler
                .write('console.error(')
                .subcompile(expr)
            ;
        }
        else {
            let varName = compiler.getVarName();

            compiler
                .write(`let ${varName} = `)
                .subcompile(expr)
                .raw(';\n')
                .write(`console.error(${varName}`)
            ;
        }

        compiler
            .raw(' + ')
            .string(` ("${this.getTemplateName()}" at line ${this.getTemplateLine()})`)
            .raw(');\n')
        ;
    }
}
