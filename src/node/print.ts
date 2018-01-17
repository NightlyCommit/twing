import TwingNode from "../node";
import TwingNodeOutputInterface from "../node-output-interface";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingNodeType from "../node-type";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface{
    constructor(expr: TwingNodeExpression, line: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        super(nodes, new TwingMap(), line, tag);

        this.type = TwingNodeType.OUTPUT;
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let exprHandler = compiler.subcompile(this.getNode('expr'));

        return (template: TwingTemplate, context: any, blocks: any) => {
            return compiler.raw(exprHandler(template, context, blocks));
        };
    }
}

export default TwingNodePrint;