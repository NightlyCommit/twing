import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode} from "../node";
import {TwingEnvironment} from "../environment";
import {type as nameType} from "../node/expression/name";
import {type as filterType} from "../node/expression/filter";
import {type as functionType} from "../node/expression/function";
import {type as constantType} from "../node/expression/constant";
import {type as blockReferenceType} from "../node/expression/block-reference"
import {type as parentType} from "../node/expression/parent";
import {type as conditionalType} from "../node/expression/conditional";
import {type as getAttrType} from "../node/expression/get-attribute";
import {type as callType} from "../node/expression/method-call";

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

        return bucket ? bucket.value : null;
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
        if (node.is(constantType)) {
            // constants are marked safe for all
            this.setSafe(node, ['all']);
        } else if (node.is(blockReferenceType)) {
            // blocks are safe by definition
            this.setSafe(node, ['all']);
        } else if (node.is(parentType)) {
            // parent block is safe by definition
            this.setSafe(node, ['all']);
        } else if (node.is(conditionalType)) {
            // intersect safeness of both operands
            let safe = this.intersectSafe(this.getSafe(node.getNode('expr2')), this.getSafe(node.getNode('expr3')));
            this.setSafe(node, safe);
        } else if (node.is(filterType)) {
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
            } else {
                this.setSafe(node, []);
            }
        } else if (node.is(functionType)) {
            // function expression is safe when the function is safe
            let name = node.getAttribute('name');
            let functionArgs = node.getNode('arguments');
            let functionNode = env.getFunction(name);

            if (functionNode) {
                this.setSafe(node, functionNode.getSafe(functionArgs));
            } else {
                this.setSafe(node, []);
            }
        } else if (node.is(callType)) {
            if (node.getAttribute('safe')) {
                this.setSafe(node, ['all']);
            } else {
                this.setSafe(node, []);
            }
        } else if (node.is(getAttrType) && node.getNode('node').is(nameType)) {
            let name = node.getNode('node').getAttribute('name');

            if (this.safeVars.includes(name)) {
                this.setSafe(node, ['all']);
            } else {
                this.setSafe(node, []);
            }
        } else {
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
