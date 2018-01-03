import TwingNode from "../node";
import TwingSource from "../source";
import TwingMap from "../map";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

/**
 * Represents a module node.
 */
class TwingNodeModule extends TwingNode {
    public source: TwingSource;

    constructor(body: TwingNode, parent: TwingNode = null, blocks: TwingNode, macros: TwingNode, traits: TwingNode, embeddedTemplates: Array<{}>, source: TwingSource) {
        let nodes = new TwingMap();

        nodes.set('body', body);
        nodes.set('blocks', blocks);
        nodes.set('macros', macros);
        nodes.set('traits', traits);

        if (parent !== null) {
            nodes.set('parent', parent);
        }

        // embedded templates are set as attributes so that they are only visited once by the visitors
        let attributes = new TwingMap();

        attributes.set('index', null);
        attributes.set('embedded_templates', embeddedTemplates);

        super(nodes, attributes, 1);

        this.source = source;

        // populate the template name of all node children
        this.setTemplateName(this.source.getName());
    }

    setIndex(index: number) {
        this.setAttribute('index', index);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        return this.getNode('body').compile(context, template, blocks);
    }
}

export default TwingNodeModule;