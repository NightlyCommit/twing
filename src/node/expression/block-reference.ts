import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingNode from "../../node";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionBlockReference extends TwingNodeExpression {
    constructor(name: TwingNode, template: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('name', name);

        if (template) {
            nodes.set('template', template);
        }

        let attributes = new TwingMap([
            ['is_defined_test', false],
            ['output', false]
        ]);

        super(nodes, attributes, lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result;

        if (this.getAttribute('is_defined_test')) {
            //$this->compileTemplateCall($compiler, 'hasBlock');
        }
        else {
            let blockName = this.getNode('name').compile(context, template, blocks);

            if (!this.hasNode('template')) {
                result = template.displayBlock(blockName, context, blocks);
            }
            else {
                let templateToUse = template.loadTemplate(
                    this.getNode('template').compile(context, template, blocks),
                    this.getTemplateName(),
                    this.getTemplateLine()
                );

                result = templateToUse.displayBlock(blockName, context, blocks);
            }
        }

        return result;
    }
}

export = TwingNodeExpressionBlockReference;