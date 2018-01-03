import TwingNode from "../../node";
import TwingNodeExpressionConstant from "./constant";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";
import TwingNodeExpressionCall from "./call";

class TwingNodeExpressionFilter extends TwingNodeExpressionCall {
    constructor(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('filter', filterName);
        nodes.set('arguments', methodArguments);

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let name = this.getNode('filter').getAttribute('value');
        let filter = template.getEnvironment().getFilter(name);

        if (filter) {
            this.callable = filter.getCallable();
        }

        this.setAttribute('needs_environment', filter.needsEnvironment());
        this.setAttribute('needs_context', filter.needsContext());

        return super.compile(context, template, blocks);
    }
}

export default TwingNodeExpressionFilter;