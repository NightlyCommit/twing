import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingMarkup = require("../markup");
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeSet extends TwingNode {
    constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('names', names);
        nodes.set('values', values);

        let attributes = new TwingMap();

        attributes.set('capture', capture);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.CAPTURE;

        if (this.getAttribute('capture')) {
            this.setAttribute('safe', true);
        }
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): string {
        let namesNode = this.getNode('names');
        let valuesNode = this.getNode('values');

        if (!this.getAttribute('capture')) {
            let names = [...namesNode.getNodes().values()];
            let values = [...valuesNode.getNodes().values()];

            let i: number;
            let count: number = names.length;

            for (i = 0; i < count; i++) {
                let name = names[i];
                let value = values[i];

                context[name.compile(context, template, blocks)] = value.compile(context, template, blocks);
            }
        }
        else {
            let values: string = valuesNode.compile(context, template, blocks);

            namesNode.getNodes().forEach(function (nameNode) {
                context[nameNode.compile(context, template, blocks)] = new TwingMarkup(values, template.getEnvironment().getCharset());
            });
        }

        return '';
    }
}

export default TwingNodeSet;