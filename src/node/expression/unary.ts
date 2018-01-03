import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");

abstract class TwingNodeExpressionUnary extends TwingNodeExpression {
    constructor(expr: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', expr);

        super(nodes, new TwingMap(), lineno);
    }

    compile(context: any, template: TwingTemplate): any {
        let expr = this.getNode('node').compile(context, template);

        return this.execute(expr);
    }

    abstract execute(expr: any): any;
}

export default TwingNodeExpressionUnary;