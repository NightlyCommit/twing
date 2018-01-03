import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");

class TwingNodeExpressionConditional extends TwingNodeExpression {
    constructor(expr1: TwingNodeExpression, expr2: TwingNodeExpression, expr3: TwingNodeExpression, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('expr1', expr1);
        nodes.set('expr2', expr2);
        nodes.set('expr3', expr3);

        super(nodes, new TwingMap(), lineno);
    }

    compile(context: any, template: TwingTemplate) {
        if (this.getNode('expr1').compile(context, template)) {
            return this.getNode('expr2').compile(context, template);
        }
        else {
            return this.getNode('expr3').compile(context, template);
        }
    }
}

export default TwingNodeExpressionConditional;