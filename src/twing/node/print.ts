import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingNodeExpression} from "./expression";

import {TwingCompiler} from "../compiler";

export class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(expr: TwingNodeExpression, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('expr', expr);

        super(nodes, new Map(), lineno, columnno, tag);

        this.TwingNodeOutputInterfaceImpl = this;

        this.type = TwingNodeType.PRINT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('Twing.echo(')
            .subcompile(this.getNode('expr'))
            .raw(');\n')
        ;
    }
}
