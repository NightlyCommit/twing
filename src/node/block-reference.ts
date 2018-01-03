import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

/**
 * Represents a block call node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingNodeBlockReference extends TwingNode {
    constructor(name: string, lineno: number, tag: string = null) {
        super(new TwingMap(), new TwingMap([['name', name]]), lineno, tag);

        this.type = TwingNodeType.OUTPUT;
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap()): any {
        // todo: refactor displayBlock as renderBlock
        return template.displayBlock(this.getAttribute('name'), context, blocks);
    }
}

export default TwingNodeBlockReference;