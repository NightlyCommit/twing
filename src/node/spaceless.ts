import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeSpaceless extends TwingNode {
    constructor(body: TwingNode, lineno: number, tag = 'spaceless') {
        let nodes = new TwingMap();

        nodes.set('body', body);

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result = this.getNode('body').compile(context, template, blocks);

        return result.replace(/>\s+</g, '><').trim();
    }
}

export = TwingNodeSpaceless;