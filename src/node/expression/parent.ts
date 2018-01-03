import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionParent extends TwingNodeExpression {
    constructor(name: string, lineno: number) {
        super(new TwingMap(), new TwingMap([['output', false], ['name', name]]), lineno);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result;

        result = template.displayParentBlock(this.getAttribute('name'), context, blocks);

        return result;
    }
}

export default TwingNodeExpressionParent;