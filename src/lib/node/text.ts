import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('text');

export class TwingNodeText extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(data: string, lineno: number, columnno: number, tag: string = null) {
        super(new Map(), new Map([['data', data]]), lineno, columnno, tag);

        this.TwingNodeOutputInterfaceImpl = this;
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addSourceMapEnter(this)
            .write('outputBuffer.echo(')
            .string(this.getAttribute('data'))
            .raw(");\n")
            .addSourceMapLeave()
        ;
    }
}
