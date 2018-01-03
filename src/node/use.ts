import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";
import TwingErrorRuntime from "../error/runtime";

class TwingNodeUse extends TwingNode {
    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let traitName = this.getNode('body').compile(context, template, blocks);
        let trait = template.loadTemplate(traitName);

        trait.compileBlocks(context, trait, blocks);

        if (!trait.isTraitable()) {
            throw new TwingErrorRuntime(`Template "${traitName}" cannot be used as a trait.`);
        }

        template.addTraits(trait.getBlocks());

        return '';
    }
}

export = TwingNodeUse;