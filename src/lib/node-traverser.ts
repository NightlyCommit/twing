/**
 * TwingNodeTraverser is a node traverser.
 *
 * It visits all nodes and their children and calls the given visitor for each.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingEnvironment} from "./environment";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingNode} from "./node";

import {ksort} from "./helpers/ksort";
import {push} from "./helpers/push";

export class TwingNodeTraverser {
    private env: TwingEnvironment;
    private visitors: Map<number, Map<string, TwingNodeVisitorInterface>> = new Map();

    /**
     *
     * @param {TwingEnvironment} env
     * @param {Array<TwingNodeVisitorInterface>} visitors
     */
    constructor(env: TwingEnvironment, visitors: Array<TwingNodeVisitorInterface> = []) {
        let self = this;

        this.env = env;

        for (let visitor of visitors) {
            self.addVisitor(visitor);
        }
    }

    addVisitor(visitor: TwingNodeVisitorInterface) {
        if (!this.visitors.has(visitor.getPriority())) {
            this.visitors.set(visitor.getPriority(), new Map());
        }

        push(this.visitors.get(visitor.getPriority()), visitor);
    }

    /**
     * Traverses a node and calls the registered visitors.
     *
     * @return TwingNode
     */
    traverse(node: TwingNode): TwingNode {
        let self = this;
        let result: TwingNode | false = node;

        ksort(this.visitors);

        for (let [index, visitors] of this.visitors) {
            for (let [index, visitor] of visitors) {
                result = self.traverseForVisitor(visitor, node);
            }
        }

        return result;
    }

    traverseForVisitor(visitor: TwingNodeVisitorInterface, node: TwingNode): TwingNode {
        let self = this;

        node = visitor.TwingNodeVisitorInterfaceImpl.enterNode(node, this.env);

        for (let [k, n] of node.getNodes()) {
            let m = self.traverseForVisitor(visitor, n);

            if (m) {
                if (m !== n) {
                    node.setNode(k, m);
                }
            }
            else {

                node.removeNode(k);
            }
        }

        return visitor.TwingNodeVisitorInterfaceImpl.leaveNode(node, this.env);
    }
}
