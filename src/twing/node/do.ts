import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";

import {TwingCompiler} from "../compiler";

/**
 * Represents a do node.
 *
 * The do tag works exactly like the regular variable expression ({{ ... }}) just that it doesn't print anything:
 * {% do 1 + 2 %}
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric Morand <eric.morand@gmail.com>
 */
export class TwingNodeDo extends TwingNode {
    constructor(expr: TwingNodeExpression, lineno: number, tag: string = null) {
        super(new Map([['expr', expr]]), new Map(), lineno, tag);

        this.type = TwingNodeType.DO;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .subcompile(this.getNode('expr'), true)
            .raw(";\n")
        ;
    }
}
