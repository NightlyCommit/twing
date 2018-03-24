import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeFlush extends TwingNode {
    constructor(lineno: number, tag: string) {
        super(new Map(), new Map(), lineno, tag);

        this.type = TwingNodeType.FLUSH;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("Twing.flush();\n")
        ;
    }
}
