import {TwingNode, TwingNodeOutputType, TwingNodeType} from "../node";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingNodeExpression} from "./expression";

import {TwingCompiler} from "../compiler";

export class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface {
    constructor(expr: TwingNodeExpression, line: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('expr', expr);

        super(nodes, new Map(), line, tag);

        this.type = TwingNodeType.PRINT;
        this.outputType = TwingNodeOutputType.OUTPUT;
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
