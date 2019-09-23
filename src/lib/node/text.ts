import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";

export class TwingNodeText extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(data: string, lineno: number, columnno: number, tag: string) {
        super(new Map(), new Map([['data', data]]), lineno, columnno, tag);

        this.type = TwingNodeType.TEXT;

        this.TwingNodeOutputInterfaceImpl = this;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addSourceMapEnter(this)
            .write('this.echo(')
            .string(this.getAttribute('data'))
            .raw(");\n")
            .addSourceMapLeave()
        ;
    }
}
