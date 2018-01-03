import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingErrorLoader from "../error/loader";
import TwingTemplateBlock from "../template-block";

const merge = require('merge');

class TwingNodeInclude extends TwingNode {
    constructor(expr: TwingNodeExpression, variables: TwingNodeExpression = null, only: boolean = false, ignoreMissing: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        if (variables !== null) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only], ['ignore_missing', ignoreMissing]]), lineno, tag);
    }

    protected getIncludedTemplate(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): TwingTemplate {
        return template.loadTemplate(
            this.getNode('expr').compile(context, template, blocks),
            this.getTemplateName(),
            this.getTemplateLine()
        );
    };

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let self = this;
        let ignoreMissing = this.getAttribute('ignore_missing');

        let includedTemplate: TwingTemplate;

        if (ignoreMissing) {
            try {
                includedTemplate = self.getIncludedTemplate(context, template, blocks);
            }
            catch (e) {
                if (e instanceof TwingErrorLoader) {
                    // ignore missing template
                    return '';
                }
                else {
                    throw e;
                }
            }
        }
        else {
            includedTemplate = self.getIncludedTemplate(context, template, blocks);
        }

        let includedContext;

        if (!this.hasNode('variables')) {
            includedContext = this.getAttribute('only') === false ? context : {};
        }
        else {
            let variables = this.getNode('variables').compile(context, template, blocks);

            if (this.getAttribute('only') === false) {
                includedContext = merge(context, variables);
            }
            else {
                includedContext = variables;
            }
        }

        return includedTemplate.render(includedContext);
    }
}

export default TwingNodeInclude;