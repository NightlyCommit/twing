import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";

export class TwingNodeText extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(data: string, lineno: number, columnno: number) {
        super(new Map(), new Map([['data', data]]), lineno, columnno);

        this.type = TwingNodeType.TEXT;

        this.TwingNodeOutputInterfaceImpl = this;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .addSourceMapEnter(this)
            .write('Runtime.echo(')
            .string(this.getAttribute('data'))
            .raw(");\n")
            .addSourceMapLeave()
        ;
    }
}
