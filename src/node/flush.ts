import TwingNode from "../node";
import TwingMap from "../map";
import TwingCompiler from "../compiler";
import TwingNodeType from "../node-type";

class TwingNodeFlush extends TwingNode {
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

export default TwingNodeFlush;