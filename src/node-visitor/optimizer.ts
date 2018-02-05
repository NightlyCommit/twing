import TwingBaseNodeVisitor from "../base-node-visitor";
import TwingNode from "../node";
import TwingEnvironment from "../environment";
import TwingNodePrint from "../node/print";
import TwingNodeExpressionBlockReference from "../node/expression/block-reference";
import TwingNodeExpressionParent from "../node/expression/parent";
import TwingNodeExpressionFilter from "../node/expression/filter";
import TwingNodeFor from "../node/for";
import TwingNodeExpressionName from "../node/expression/name";
import TwingNodeBlockReference from "../node/block-reference";
import TwingNodeInclude from "../node/include";
import TwingNodeExpressionFunction from "../node/expression/function";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionGetAttr from "../node/expression/get-attr";

const isInteger = require('is-integer');

/**
 * Twig_NodeVisitor_Optimizer tries to optimizes the AST.
 *
 * This visitor is always the last registered one.
 *
 * You can configure which optimizations you want to activate via the
 * optimizer mode.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingNodeVisitorOptimizer extends TwingBaseNodeVisitor {
    readonly OPTIMIZE_ALL = -1;
    readonly OPTIMIZE_NONE = 0;
    readonly OPTIMIZE_FOR = 2;
    readonly OPTIMIZE_RAW_FILTER = 4;
    // obsolete, does not do anything
    readonly OPTIMIZE_VAR_ACCESS = 8;

    private loops: Array<TwingNode> = [];
    private loopsTargets: Array<TwingNode> = [];
    private optimizers: number;

    /**
     * @param {number} optimizers The optimizer mode
     */
    constructor(optimizers: number = -1) {
        super();

        if (!isInteger(optimizers) || optimizers > (this.OPTIMIZE_FOR | this.OPTIMIZE_RAW_FILTER | this.OPTIMIZE_VAR_ACCESS)) {
            throw new Error(`Optimizer mode "${optimizers}" is not valid.`);
        }

        this.optimizers = optimizers;
    }

    doEnterNode(node: TwingNode, env: TwingEnvironment) {
        if (this.OPTIMIZE_FOR === (this.OPTIMIZE_FOR & this.optimizers)) {
            this.enterOptimizeFor(node, env);
        }

        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if (this.OPTIMIZE_FOR === (this.OPTIMIZE_FOR & this.optimizers)) {
            this.leaveOptimizeFor(node, env);
        }

        if (this.OPTIMIZE_RAW_FILTER === (this.OPTIMIZE_RAW_FILTER & this.optimizers)) {
            node = this.optimizeRawFilter(node, env);
        }

        node = this.optimizePrintNode(node, env);

        return node;
    }

    /**
     * Optimizes print nodes.
     *
     * It replaces:
     *
     *   * "echo $this->render(Parent)Block()" with "$this->display(Parent)Block()"
     *
     * @return Twig_Node
     */
    optimizePrintNode(node: TwingNode, env: TwingEnvironment) {
        if (!(node instanceof TwingNodePrint)) {
            return node;
        }

        let exprNode = node.getNode('expr');

        if (exprNode as any instanceof TwingNodeExpressionBlockReference ||
            exprNode as any instanceof TwingNodeExpressionParent) {
            exprNode.setAttribute('output', true);

            return exprNode;
        }

        return node;
    }

    /**
     * Removes "raw" filters.
     *
     * @returns {TwingNode}
     */
    optimizeRawFilter(node: TwingNode, env: TwingEnvironment) {
        if (node instanceof TwingNodeExpressionFilter && node.getNode('filter').getAttribute('value') === 'raw') {
            return node.getNode('node');
        }

        return node;
    }

    /**
     * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
     */
    enterOptimizeFor(node: TwingNode, env: TwingEnvironment) {
        if (node as any instanceof TwingNodeFor) {
            // disable the loop variable by default
            node.setAttribute('with_loop', false);
            this.loops.unshift(node);
            this.loopsTargets.unshift(node.getNode('value_target').getAttribute('name'));
            this.loopsTargets.unshift(node.getNode('key_target').getAttribute('name'));
        }
        else if (this.loops.length < 1) {
            // we are outside a loop
            return;
        }

        // when do we need to add the loop variable back?

        // the loop variable is referenced for the active loop
        else if (node as any instanceof TwingNodeExpressionName && node.getAttribute('name') === 'loop') {
            node.setAttribute('always_defined', true);
            this.addLoopToCurrent();
        }

        // optimize access to loop targets
        else if (node as any instanceof TwingNodeExpressionName && this.loopsTargets.includes(node.getAttribute('name'))) {
            node.setAttribute('always_defined', true);
        }

        // block reference
        else if (node as any instanceof TwingNodeBlockReference || node as any instanceof TwingNodeExpressionBlockReference) {
            this.addLoopToCurrent();
        }

        // include without the only attribute
        else if (node as any instanceof TwingNodeInclude && !node.getAttribute('only')) {
            this.addLoopToAll();
        }

        // include function without the with_context=false parameter
        else if (node as any instanceof TwingNodeExpressionFunction && node.getAttribute('name') === 'include' && (!node.getNode('arguments').hasNode('with_context') || node.getNode('arguments').getNode('with_context').getAttribute('value') !== false)) {
            this.addLoopToAll();
        }

        // the loop variable is referenced via an attribute
        else if (node as any instanceof TwingNodeExpressionGetAttr && (!node.getNode('attribute') as any instanceof TwingNodeExpressionConstant || node.getNode('attribute').getAttribute('value') === 'parent') && (this.loops[0].getAttribute('with_loop') === true || (node.getNode('node') as any instanceof TwingNodeExpressionName && node.getNode('node').getAttribute('name') === 'loop'))) {
            this.addLoopToAll();
        }
    }

    /**
     * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
     */
    leaveOptimizeFor(node: TwingNode, env: TwingEnvironment) {
        if (node instanceof TwingNodeFor) {
            this.loops.shift();
            this.loopsTargets.shift();
            this.loopsTargets.shift();
        }
    }

    addLoopToCurrent() {
        this.loops[0].setAttribute('with_loop', true);
    }

    addLoopToAll() {
        for (let loop of this.loops) {
            loop.setAttribute('with_loop', true);
        }
    }

    getPriority() {
        return 255;
    }
}

export default TwingNodeVisitorOptimizer;