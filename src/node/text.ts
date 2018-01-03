import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

class TwingNodeText extends TwingNode {
    constructor(data: string, line: number) {
        super(new TwingMap(), new TwingMap([['data', data]]), line);

        this.type = TwingNodeType.OUTPUT;
    }

    compile(context: {}, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result = this.getAttribute('data');

        return result;
    }
}

export default TwingNodeText;