import TwingNode from "../node";
import TwingNodeOutputInterface from "../node-output-interface";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingNodeType from "../node-type";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface{
    constructor(expr: TwingNodeExpression, line: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        super(nodes, new TwingMap(), line, tag);

        this.type = TwingNodeType.PRINT;
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result = this.getNode('expr').compile(context, template, blocks);

        // as per PHP specifications, true is output as '1' and false as ''
        if (typeof result === 'boolean') {
            return result ? '1' : '';
        }

        return result;
    }
}

export default TwingNodePrint;