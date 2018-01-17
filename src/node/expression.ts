import TwingNode from "../node";

/**
 * Abstract class for all nodes that represents an expression.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
abstract class TwingNodeExpression extends TwingNode {
    // todo: until typescript@2.7 is released, we have to add that dummy property
    // @see https://github.com/Microsoft/TypeScript/issues/18276
    // @see https://github.com/Microsoft/TypeScript/pull/19671
    private dummy: any;
}

export default TwingNodeExpression;