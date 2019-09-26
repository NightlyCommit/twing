import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeFlush extends TwingNode {
    constructor(lineno: number, columnno: number, tag: string) {
        super(new Map(), new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.FLUSH;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("this.flushOutputBuffer();\n")
        ;
    }
}
