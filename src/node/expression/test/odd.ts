import TwingNodeExpressionTest from "../test";
import TwingTemplate = require("../../../template");
import TwingMap from "../../../map";
import TwingTemplateBlock from "../../../template-block";

class TwingNodeExpressionTestOdd extends TwingNodeExpressionTest {
    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        return this.getNode('node').compile(context, template, blocks) % 2 === 1;
    }
}

export = TwingNodeExpressionTestOdd;