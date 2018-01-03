import TwingBaseNodeVisitor = require("../base-node-visitor");
import TwingNode from "../node";
import TwingEnvironment = require("../environment");
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionBlockReference = require("../node/expression/block-reference");
import TwingNodeExpressionParent from "../node/expression/parent";
import TwingNodeExpressionConditional from "../node/expression/conditional";
import TwingNodeExpressionFilter from "../node/expression/filter";
import TwingNodeExpressionFunction = require("../node/expression/function");
import TwingNodeExpressionMethodCall from "../node/expression/method-call";
import TwingNodeExpressionGetAttr from "../node/expression/get-attr";
import TwingNodeExpressionName from "../node/expression/name";
import TwingMap from "../map";
import has = Reflect.has;

var objectHash = require('object-hash');

interface Bucket {
    key: any,
    value: Array<string>
}

class TwingNodeVisitorSafeAnalysis extends TwingBaseNodeVisitor {
    private data: TwingMap<string, Array<Bucket>> = new TwingMap();
    private safeVars: Array<any> = [];

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

        let bucket = this.data.get(hash).find(function(bucket: Bucket) {
            if (bucket.key === node) {
                if (bucket.value.includes('html_attr')) {
                    bucket.value.push('html');
                }

                return true;
            }
        });

        return bucket ? bucket.value : null;
    }

    setSafe(node: TwingNode, safe: Array<string>) {
        let hash = objectHash(node);
        let bucket = null;

        if (this.data.has(hash)) {
            bucket = this.data.get(hash).find(function(bucket: Bucket) {
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

    doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node instanceof TwingNodeExpressionConstant) {
            // constants are marked safe for all
            this.setSafe(node, ['all']);
        }
        else if (node instanceof TwingNodeExpressionBlockReference) {
            // blocks are safe by definition
            this.setSafe(node, ['all']);
        }
        else if (node instanceof TwingNodeExpressionParent) {
            // parent block is safe by definition
            this.setSafe(node, ['all']);
        }
        else if (node instanceof TwingNodeExpressionConditional) {
            // intersect safeness of both operands
            let safe = this.intersectSafe(this.getSafe(node.getNode('expr2')), this.getSafe(node.getNode('expr3')));
            this.setSafe(node, safe);
        }
        else if (node instanceof TwingNodeExpressionFilter) {
            // filter expression is safe when the filter is safe
            let name = node.getNode('filter').getAttribute('value');
            let filterArgs = node.getNode('arguments');
            let filter = env.getFilter(name);

            if (filter) {
                let safe = filter.getSafe(filterArgs);

                if (!safe) {
                    safe = this.intersectSafe(this.getSafe(node.getNode('node')), filter.getPreservesSafety());
                }

                this.setSafe(node, safe);
            }
            else {
                this.setSafe(node, []);
            }
        }
        else if (node instanceof TwingNodeExpressionFunction) {
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
        else if (node instanceof TwingNodeExpressionMethodCall) {
            if (node.getAttribute('safe')) {
                this.setSafe(node, ['all']);
            }
            else {
                this.setSafe(node, []);
            }
        }
        else if (node instanceof TwingNodeExpressionGetAttr && node.getNode('node') instanceof TwingNodeExpressionName) {
            let name = node.getNode('node').getAttribute('name');

            if (this.safeVars.indexOf(name) > -1) {
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

    private intersectSafe(a: Array<any> = null, b: Array<any> = null) {
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

export = TwingNodeVisitorSafeAnalysis;