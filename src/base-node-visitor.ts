import TwingNodeVisitorInterface from "./node-visitor-interface";
import TwingNode from "./node";
import TwingEnvironment from "./environment";

abstract class TwingBaseNodeVisitor implements TwingNodeVisitorInterface {
    getPriority(): number {
        throw new Error("Method not implemented.");
    }

    /**
     * Called before child nodes are visited.
     *
     * @returns {TwingNode} The modified node
     */
    enterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return this.doEnterNode(node, env);
    }

    /**
     * Called after child nodes are visited.
     *
     * @returns {TwingNode|false} The modified node or null if the node must be removed
     */
    leaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        return this.doLeaveNode(node, env);
    }

    /**
     * Called before child nodes are visited.
     *
     * @returns {TwingNode} The modified node
     */
    abstract doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

    /**
     * Called after child nodes are visited.
     *
     * @returns {TwingNode|false} The modified node or null if the node must be removed
     */
    abstract doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;
}

export default TwingBaseNodeVisitor;