/**
 * Twig_NodeTraverser is a node traverser.
 *
 * It visits all nodes and their children and calls the given visitor for each.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import TwingEnvironment from "./environment";
import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingNode from "./node";
import TwingMap from "./map";

class TwingNodeTraverser {
    private env: TwingEnvironment;
    private visitors: TwingMap<string, TwingMap<string, TwingNodeVisitorInterface>> = new TwingMap();

    /**
     *
     * @param {TwingEnvironment} env
     * @param {Array<TwingNodeVisitorInterface>} visitors
     */
    constructor(env: TwingEnvironment, visitors: Array<TwingNodeVisitorInterface> = []) {
        let self = this;

        this.env = env;

        visitors.forEach(function (visitor) {
            self.addVisitor(visitor);
        });
    }

    addVisitor(visitor: TwingNodeVisitorInterface) {
        if (!this.visitors.has(visitor.getPriority())) {
            this.visitors.set(visitor.getPriority(), new TwingMap());
        }

        this.visitors.get(visitor.getPriority()).push(visitor);
    }

    /**
     * Traverses a node and calls the registered visitors.
     *
     * @return TwingNode
     */
    traverse(node: TwingNode): TwingNode {
        let self = this;
        let result: TwingNode | false = node;

        this.visitors.sortByKeys();

        for (let [index, visitors] of this.visitors) {
            for (let [index, visitor] of visitors) {
                result = self.traverseForVisitor(visitor, node);
            }
        }

        return result;
    }

    traverseForVisitor(visitor: TwingNodeVisitorInterface, node: TwingNode): TwingNode {
        let self = this;

        node = visitor.enterNode(node, this.env);

        for (let [k, n] of node.getNodes()) {
            if (n = self.traverseForVisitor(visitor, n)) {
                node.setNode(k, n);
            }
            else {
                node.removeNode(k);
            }
        }

        return visitor.leaveNode(node, this.env);
    }
}

export default TwingNodeTraverser;