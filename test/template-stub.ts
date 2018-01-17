import TwingTemplate from "../src/template";
import TwingNodeModule from "../src/node/module";

class TwingTestTemplateStub extends  TwingTemplate {
    constructor(node: TwingNodeModule) {
        super(null, node);
    }
}

export default TwingTestTemplateStub;