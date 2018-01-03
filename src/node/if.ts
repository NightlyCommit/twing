import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeIf extends TwingNode {
    constructor(tests: TwingNode, elseNode: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('tests', tests);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap) {
        let result = '';

        let i = 0;
        let count = this.getNode('tests').getNodes().length();

        let condition = false;
        let conditionNode = null;
        let valueNode = null;

        while (!condition && i < count) {
            conditionNode = this.getNode('tests').getNode(i);
            valueNode = this.getNode('tests').getNode(i + 1);

            condition = conditionNode.compile(context, template, blocks);

            i += 2;
        }

        if (condition) {
            result = valueNode.compile(context, template, blocks);
        }
        else if (this.hasNode('else')) {
            result = this.getNode('else').compile(context, template, blocks);
        }

        return result;
    }
}

export = TwingNodeIf;