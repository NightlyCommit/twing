import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('inline_print');

export class TwingNodeInlinePrint extends TwingNode {
    constructor(node: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['node', node]]), new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('outputBuffer.echo(')
            .subcompile(this.getNode('node'))
            .raw(')')
        ;
    }
}
