import TwingTemplate = require("./template");
import TwingMap from "./map";
import TwingTemplateBlock from "./template-block";

interface TwingNodeInterface {
    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock>): any;
}

export default TwingNodeInterface;