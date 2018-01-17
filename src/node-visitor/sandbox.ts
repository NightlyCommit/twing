import TwingBaseNodeVisitor from "../base-node-visitor";
import TwingEnvironment from "../environment";
import TwingNode from "../node";
import TwingNodeModule from "../node/module";
import TwingMap from "../map";
import TwingNodeExpressionFilter from "../node/expression/filter";
import TwingNodePrint from "../node/print";
import TwingNodeExpressionFunction from "../node/expression/function";
import TwingNodeSandboxedPrint from "../node/sandboxed-print";
import TwingNodeExpression from "../node/expression";
import TwingNodeCheckSecurity from "../node/check-security";

class TwingNodeVisitorSandbox extends TwingBaseNodeVisitor {
    private inAModule: boolean = false;
    private tags: TwingMap<string, TwingNode>;
    private filters: TwingMap<string, TwingNode>;
    private functions: TwingMap<string, TwingNode>;

    doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node instanceof TwingNodeModule) {
            this.inAModule = true;
            this.tags = new TwingMap();
            this.filters = new TwingMap();
            this.functions = new TwingMap();

            return node;
        }
        else if (this.inAModule) {
            // look for tags
            if (node.getNodeTag() && !(this.tags.has(node.getNodeTag()))) {
                this.tags.set(node.getNodeTag(), node);
            }

            // look for filters
            if (node instanceof TwingNodeExpressionFilter && !this.filters.has(node.getNode('filter').getAttribute('value'))) {
                this.filters.set(node.getNode('filter').getAttribute('value'), node);
            }

            // look for functions
            if (node instanceof TwingNodeExpressionFunction && !this.functions.has(node.getAttribute('name'))) {
                this.functions.set(node.getAttribute('name'), node);
            }

            // wrap print to check toString() calls
            if (node instanceof TwingNodePrint) {
                return new TwingNodeSandboxedPrint(node.getNode('expr') as TwingNodeExpression, node.getTemplateLine(), node.getNodeTag());
            }
        }

        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node instanceof TwingNodeModule) {
            this.inAModule = false;

            let nodes = new TwingMap();

            nodes.push(new TwingNodeCheckSecurity(this.filters, this.tags, this.functions));
            nodes.push(node.getNode('display_start'));

            node.setNode('display_start', new TwingNode(nodes));
        }

        return node;
    }

    getPriority(): number {
        return 0;
    }
}

export default TwingNodeVisitorSandbox;