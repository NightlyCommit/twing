import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingNodeInclude from "./include";
import TwingNodeExpressionConstant from "./expression/constant";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

const merge = require('merge');

class TwingNodeEmbed extends TwingNodeInclude {
    // we don't inject the module to avoid node visitors to traverse it twice (as it will be already visited in the main module)
    constructor(name: string, index: string, variables: TwingNodeExpression = null, only: boolean = false, ignoreMissing: boolean = false, lineno: number, tag: string = null) {
        super(new TwingNodeExpressionConstant('not_used', lineno), variables, only, ignoreMissing, lineno, tag);

        this.setAttribute('name', name);
        this.setAttribute('index', index);
    }

    addGetTemplate(compiler: TwingCompiler): DoDisplayHandler {
        return (template: TwingTemplate) => {
            return template.loadTemplate(
                this.getAttribute('name'),
                this.getTemplateName(),
                this.getTemplateLine(),
                this.getAttribute('index')
            );
        }
    }
}

export default TwingNodeEmbed;