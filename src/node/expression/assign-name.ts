import TwingNodeExpressionName from "./name";
import TwingTemplate = require("../../template");
import TwingMap from "../../map";
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        return this.getAttribute('name');
    }
}

export default TwingNodeExpressionAssignName;