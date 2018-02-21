import TwingNode from "../node";
import TwingNodeOutputInterface from "../node-output-interface";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingNodeType from "../node-type";
import TwingCompiler from "../compiler";
import TwingNodeOutputType from "../node-output-type";

class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface{
    constructor(expr: TwingNodeExpression, line: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        super(nodes, new TwingMap(), line, tag);

        this.type = TwingNodeType.PRINT;
        this.outputType = TwingNodeOutputType.OUTPUT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('Twing.echo(')
            .subcompile(this.getNode('expr'))
            .raw(');\n')
        ;
    }
}

export default TwingNodePrint;