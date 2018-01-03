import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";
import TwingNodeInclude from "./include";
import TwingNodeExpressionConstant from "./expression/constant";

const merge = require('merge');

class TwingNodeEmbed extends TwingNodeInclude {
    // we don't inject the module to avoid node visitors to traverse it twice (as it will be already visited in the main module)
    constructor(name: string, index: string, variables: TwingNodeExpression = null, only: boolean = false, ignoreMissing: boolean = false, lineno: number, tag: string = null) {
        super(new TwingNodeExpressionConstant('not_used', lineno), variables, only, ignoreMissing, lineno, tag);

        this.setAttribute('name', name);
        this.setAttribute('index', index);
    }

    protected getIncludedTemplate(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): TwingTemplate {
        return template.getEmbeddedTemplate(this.getAttribute('index'));
    };
}

export = TwingNodeEmbed;