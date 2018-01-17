import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

abstract class TwingNodeExpressionUnary extends TwingNodeExpression {
    constructor(expr: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', expr);

        super(nodes, new TwingMap(), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let nodeHandler = compiler.subcompile(this.getNode('node'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return this.execute(
                nodeHandler(template, context, blocks),
            );
        }
    }

    abstract execute(expr: any): any;
}

export default TwingNodeExpressionUnary;