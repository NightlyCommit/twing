import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingEnvironment} from "../environment";
import {TwingNode, TwingNodeType} from "../node";

import {TwingNodeSandboxedPrint} from "../node/sandboxed-print";
import {TwingNodeExpression} from "../node/expression";
import {TwingNodeCheckSecurity} from "../node/check-security";

export class TwingNodeVisitorSandbox extends TwingBaseNodeVisitor {
    private inAModule: boolean = false;
    private tags: Map<string, TwingNode>;
    private filters: Map<string, TwingNode>;
    private functions: Map<string, TwingNode>;

    doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.MODULE) {
            this.inAModule = true;
            this.tags = new Map();
            this.filters = new Map();
            this.functions = new Map();

            return node;
        }
        else if (this.inAModule) {
            // look for tags
            if (node.getNodeTag() && !(this.tags.has(node.getNodeTag()))) {
                this.tags.set(node.getNodeTag(), node);
            }

            // look for filters
            if (node.getType() === TwingNodeType.EXPRESSION_FILTER && !this.filters.has(node.getNode('filter').getAttribute('value'))) {
                this.filters.set(node.getNode('filter').getAttribute('value'), node);
            }

            // look for functions
            if (node.getType() === TwingNodeType.EXPRESSION_FUNCTION && !this.functions.has(node.getAttribute('name'))) {
                this.functions.set(node.getAttribute('name'), node);
            }

            // wrap print to check toString() calls
            if (node.getType() === TwingNodeType.PRINT) {
                return new TwingNodeSandboxedPrint(node.getNode('expr') as TwingNodeExpression, node.getTemplateLine(), node.getNodeTag());
            }
        }

        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.MODULE) {
            this.inAModule = false;

            let nodes = new Map();
            let i: number = 0;

            nodes.set(i++, new TwingNodeCheckSecurity(this.filters, this.tags, this.functions));
            nodes.set(i++, node.getNode('display_start'));

            node.setNode('display_start', new TwingNode(nodes));
        }

        return node;
    }

    getPriority(): number {
        return 0;
    }
}
