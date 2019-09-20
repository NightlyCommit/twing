import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";

export class TwingNodeInlinePrint extends TwingNode {
    constructor(node: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['node', node]]), new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.INLINE_PRINT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('this.echo(')
            .subcompile(this.getNode('node'))
            .raw(')')
        ;
    }
}
