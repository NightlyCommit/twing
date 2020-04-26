/**
 * Represents a deprecated node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingNode} from "../node";
import {TwingNodeExpression} from "./expression";
import {type as constantType} from "./expression/constant";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('deprecated');

export class TwingNodeDeprecated extends TwingNode {
    constructor(expr: TwingNodeExpression, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['expr', expr]]), new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        let expr = this.getNode('expr');

        if (expr.is(constantType)) {
            compiler
                .write('console.warn(')
                .subcompile(expr)
            ;
        }
        else {
            let varName = compiler.getVarName();

            compiler
                .write(`let ${varName} = `)
                .subcompile(expr)
                .raw(';\n')
                .write(`console.warn(${varName}`)
            ;
        }

        compiler
            .raw(' + ')
            .string(` ("${this.getTemplateName()}" at line ${this.getTemplateLine()})`)
            .raw(');\n')
        ;
    }
}
