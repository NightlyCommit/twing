import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");

abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(left: TwingNode, right: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('left', left);
        nodes.set('right', right);

        super(nodes, new TwingMap(), lineno);
    }

    compile(context: any, template: TwingTemplate): any {
        let left = this.getNode('left').compile(context, template);
        let right = this.getNode('right').compile(context, template);

        return this.execute(left, right);
    }

    abstract execute(left: any, right: any): any;
}

export = TwingNodeExpressionBinary;