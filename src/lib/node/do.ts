import {TwingNode} from "../node";
import {TwingNodeExpression} from "./expression";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('do');

/**
 * Represents a do node.
 *
 * The do tag works exactly like the regular variable expression ({{ ... }}) just that it doesn't print anything:
 * {% do 1 + 2 %}
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 * @author Eric Morand <eric.morand@gmail.com>
 */
export class TwingNodeDo extends TwingNode {
    constructor(expr: TwingNodeExpression, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['expr', expr]]), new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .subcompile(this.getNode('expr'), true)
            .raw(";\n")
        ;
    }
}
