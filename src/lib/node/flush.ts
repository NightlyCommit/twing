import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('flush');

export class TwingNodeFlush extends TwingNode {
    constructor(lineno: number, columnno: number, tag: string) {
        super(new Map(), new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("outputBuffer.flush();\n")
        ;
    }
}
