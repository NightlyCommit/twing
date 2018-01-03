/**
 * Represents an import node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */

import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";
import TwingNodeExpressionName from "./expression/name";
import TwingNodeMacro from "./macro";

class TwingNodeImport extends TwingNode {
    constructor(expr: TwingNodeExpression, varName: TwingNodeExpression, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);
        nodes.set('var', varName);

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let importedTemplateName = this.getNode('var').compile(context, template, blocks);
        let importedTemplate: TwingTemplate;

        if ((this.getNode('expr') instanceof TwingNodeExpressionName) && (this.getNode('expr').getAttribute('name') === '_self')) {
            importedTemplate = template;
        }
        else {
            importedTemplate = template.loadTemplate(this.getNode('expr').compile(context, template, blocks), this.getTemplateName(), this.getTemplateLine());
            // todo: this is not very nice. If the template was already loaded, the macros are compiled twice or more
            importedTemplate.compileMacros(context, importedTemplate, blocks);
        }

        context[importedTemplateName] = importedTemplate;

        return null;
    }
}

export default TwingNodeImport;
