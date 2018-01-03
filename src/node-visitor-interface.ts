/**
 * Twig_NodeVisitorInterface is the interface the all node visitor classes must implement.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import TwingNode from "./node";
import TwingEnvironment from "./environment";

interface TwingNodeVisitorInterface {
    /**
     * Called before child nodes are visited.
     *
     * @return Twig_Node The modified node
     */
    enterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

    /**
     * Called after child nodes are visited.
     *
     * @return Twig_Node The modified node or null if the node must be removed
     */
    leaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

    /**
     * Returns the priority for this visitor.
     *
     * Priority should be between -10 and 10 (0 is the default).
     *
     * @return int The priority level
     */
    getPriority(): number;
}

export default TwingNodeVisitorInterface;