import {TwingNode} from "../node";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingNodeExpression} from "./expression";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('print');

export class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(expr: TwingNodeExpression, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('expr', expr);

        super(nodes, new Map(), lineno, columnno, tag);

        this.TwingNodeOutputInterfaceImpl = this;
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addSourceMapEnter(this)
            .write('outputBuffer.echo(')
            .subcompile(this.getNode('expr'))
            .raw(');\n')
            .addSourceMapLeave()
        ;
    }
}
