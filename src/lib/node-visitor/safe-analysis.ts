import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";

const objectHash = require('object-hash');

interface Bucket {
    key: any,
    value: Array<string>
}

export class TwingNodeVisitorSafeAnalysis extends TwingBaseNodeVisitor {
    private data: Map<string, Array<Bucket>> = new Map();
    private safeVars: Array<any> = [];

    constructor() {
        super();

        this.TwingNodeVisitorInterfaceImpl = this;
    }

    setSafeVars(safeVars: Array<any>) {
        this.safeVars = safeVars;
    }

    /**
     *
     * @param {TwingNode} node
     * @returns {Array<string>}
     */
    getSafe(node: TwingNode): Array<TwingNode | string | false> {
        let hash = objectHash(node);

        if (!this.data.has(hash)) {
            return;
        }

        let bucket = this.data.get(hash).find(function (bucket: Bucket) {
            if (bucket.key === node) {
                if (bucket.value.includes('html_attr')) {
                    bucket.value.push('html');
                }

                return true;
            }
        });

        return bucket.value;
    }

    private setSafe(node: TwingNode, safe: Array<string>) {
        let hash = objectHash(node);
        let bucket = null;

        if (this.data.has(hash)) {
            bucket = this.data.get(hash).find(function (bucket: Bucket) {
                if (bucket.key === node) {
                    bucket.value = safe;

                    return true;
                }
            });
        }

        if (!bucket) {
            if (!this.data.has(hash)) {
                this.data.set(hash, []);
            }

            this.data.get(hash).push({
                key: node,
                value: safe
            });
        }
    }

    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
            // constants are marked safe for all
            this.setSafe(node, ['all']);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_BLOCK_REFERENCE) {
            // blocks are safe by definition
            this.setSafe(node, ['all']);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_PARENT) {
            // parent block is safe by definition
            this.setSafe(node, ['all']);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_CONDITIONAL) {
            // intersect safeness of both operands
            let safe = this.intersectSafe(this.getSafe(node.getNode('expr2')), this.getSafe(node.getNode('expr3')));
            this.setSafe(node, safe);
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_FILTER) {
            // filter expression is safe when the filter is safe
            let name = node.getNode('filter').getAttribute('value');
            let filterArgs = node.getNode('arguments');
            let filter = env.getFilter(name);

            if (filter) {
                let safe = filter.getSafe(filterArgs);

                if (safe.length < 1) {
                    safe = this.intersectSafe(this.getSafe(node.getNode('node')), filter.getPreservesSafety());
                }

                this.setSafe(node, safe);
            }
            else {
                this.setSafe(node, []);
            }
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_FUNCTION) {
            // function expression is safe when the function is safe
            let name = node.getAttribute('name');
            let functionArgs = node.getNode('arguments');
            let functionNode = env.getFunction(name);

            if (functionNode) {
                this.setSafe(node, functionNode.getSafe(functionArgs));
            }
            else {
                this.setSafe(node, []);
            }
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_METHOD_CALL) {
            if (node.getAttribute('safe')) {
                this.setSafe(node, ['all']);
            }
            else {
                this.setSafe(node, []);
            }
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_GET_ATTR && node.getNode('node').getType() === TwingNodeType.EXPRESSION_NAME) {
            let name = node.getNode('node').getAttribute('name');

            if (this.safeVars.includes(name)) {
                this.setSafe(node, ['all']);
            }
            else {
                this.setSafe(node, []);
            }
        }
        else {
            this.setSafe(node, []);
        }

        return node;
    }

    private intersectSafe(a: Array<any>, b: Array<any>) {
        if (a === null || b === null) {
            return [];
        }

        if (a.includes('all')) {
            return b;
        }

        if (b.includes('all')) {
            return a;
        }

        // array_intersect
        return a.filter(function (n) {
            return b.includes(n);
        });
    }

    getPriority() {
        return 0;
    }
}
