import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(left: TwingNode, right: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('left', left);
        nodes.set('right', right);

        super(nodes, new TwingMap(), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let leftHandler = compiler.subcompile(this.getNode('left'));
        let rightHandler = compiler.subcompile(this.getNode('right'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return this.execute(
              leftHandler(template, context, blocks),
              rightHandler(template, context, blocks)
            );
        }
    }

    abstract execute(left: any, right: any): any;
}

export default TwingNodeExpressionBinary;