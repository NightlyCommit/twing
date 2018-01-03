import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeBlock extends TwingNode {
    constructor(name: string, body: TwingNode, lineno: number, tag: string = null) {
        super(new TwingMap([['body', body]]), new TwingMap([['name', name]]), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let self = this;
        let blockName = this.getAttribute('name');

        let block = function (context: any, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap) {
            let output = self.getNode('body').compile(context, template, blocks);

            return output;
        };

        template.setBlock(blockName, {
            block: block,
            template: template
        });

        return '';
    }
}

export default TwingNodeBlock;