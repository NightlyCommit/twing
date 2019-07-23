import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingEnvironment} from "../environment";
import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeCheckSecurity} from "../node/check-security";
import {TwingNodeCheckToString} from "../node/check-to-string";

export class TwingNodeVisitorSandbox extends TwingBaseNodeVisitor {
    private inAModule: boolean = false;
    private tags: Map<string, TwingNode>;
    private filters: Map<string, TwingNode>;
    private functions: Map<string, TwingNode>;
    private needsToStringWrap: boolean;

    constructor() {
        super();

        this.TwingNodeVisitorInterfaceImpl = this;
    }

    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.MODULE) {
            this.inAModule = true;
            this.tags = new Map();
            this.filters = new Map();
            this.functions = new Map();

            return node;
        } else if (this.inAModule) {
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

            // the .. operator is equivalent to the range() function
            if (node.getType() === TwingNodeType.EXPRESSION_BINARY_RANGE && !(this.functions.has('range'))) {
                this.functions.set('range', node);
            }

            // wrap print to check toString() calls
            if (node.getType() === TwingNodeType.PRINT) {
                this.needsToStringWrap = true;
                this.wrapNode(node, 'expr');
            }

            if (node.getType() === TwingNodeType.SET && !node.getAttribute('capture')) {
                this.needsToStringWrap = true;
            }

            // wrap outer nodes that can implicitly call toString()
            if (this.needsToStringWrap) {
                if (node.getType() === TwingNodeType.EXPRESSION_BINARY_CONCAT) {
                    this.wrapNode(node, 'left');
                    this.wrapNode(node, 'right');
                }
                if (node.getType() === TwingNodeType.EXPRESSION_FILTER) {
                    this.wrapNode(node, 'node');
                    this.wrapArrayNode(node, 'arguments');
                }
                if (node.getType() === TwingNodeType.EXPRESSION_FUNCTION) {
                    this.wrapArrayNode(node, 'arguments');
                }
            }
        }

        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.MODULE) {
            this.inAModule = false;

            let nodes = new Map();
            let i: number = 0;

            nodes.set(i++, new TwingNodeCheckSecurity(this.filters, this.tags, this.functions));
            nodes.set(i++, node.getNode('display_start'));

            node.getNode('constructor_end').setNode('_security_check', new TwingNode(nodes));
        } else if (this.inAModule) {
            if (node.getType() === TwingNodeType.PRINT || node.getType() === TwingNodeType.SET) {
                this.needsToStringWrap = false;
            }
        }

        return node;
    }

    private wrapNode(node: TwingNode, name: string) {
        let expr = node.getNode(name);

        if (expr.getType() === TwingNodeType.EXPRESSION_NAME || expr.getType() === TwingNodeType.EXPRESSION_GET_ATTR) {
            node.setNode(name, new TwingNodeCheckToString(expr));
        }
    }

    private wrapArrayNode(node: TwingNode, name: string) {
        let args = node.getNode(name);

        for (let [name] of args.getNodes()) {
            this.wrapNode(args, name as string);
        }
    }

    getPriority(): number {
        return 0;
    }
}
