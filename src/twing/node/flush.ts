import {TwingNode, TwingNodeType} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";

export class TwingNodeFlush extends TwingNode {
    constructor(lineno: number, tag: string) {
        super(new TwingMap(), new TwingMap(), lineno, tag);

        this.type = TwingNodeType.FLUSH;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("Twing.flush();\n")
        ;
    }
}
