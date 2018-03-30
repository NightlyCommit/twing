import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";

const isInteger = require('is-integer');

/**
 * TwingNodeVisitorOptimizer tries to optimizes the AST.
 *
 * This visitor is always the last registered one.
 *
 * You can configure which optimizations you want to activate via the
 * optimizer mode.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeVisitorOptimizer extends TwingBaseNodeVisitor {
    static readonly OPTIMIZE_ALL = -1;
    static readonly OPTIMIZE_NONE = 0;
    static readonly OPTIMIZE_FOR = 2;
    static readonly OPTIMIZE_RAW_FILTER = 4;
    // obsolete, does not do anything
    static readonly OPTIMIZE_VAR_ACCESS = 8;

    private loops: Array<TwingNode> = [];
    private loopsTargets: Array<TwingNode> = [];
    private optimizers: number;

    /**
     * @param {number} optimizers The optimizer mode
     */
    constructor(optimizers: number = -1) {
        super();

        this.TwingNodeVisitorInterfaceImpl = this;

        if (!isInteger(optimizers) || optimizers > (TwingNodeVisitorOptimizer.OPTIMIZE_FOR | TwingNodeVisitorOptimizer.OPTIMIZE_RAW_FILTER | TwingNodeVisitorOptimizer.OPTIMIZE_VAR_ACCESS)) {
            throw new Error(`Optimizer mode "${optimizers}" is not valid.`);
        }

        this.optimizers = optimizers;
    }

    doEnterNode(node: TwingNode, env: TwingEnvironment) {
        if (TwingNodeVisitorOptimizer.OPTIMIZE_FOR === (TwingNodeVisitorOptimizer.OPTIMIZE_FOR & this.optimizers)) {
            this.enterOptimizeFor(node, env);
        }

        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment) {
        if (TwingNodeVisitorOptimizer.OPTIMIZE_FOR === (TwingNodeVisitorOptimizer.OPTIMIZE_FOR & this.optimizers)) {
            this.leaveOptimizeFor(node, env);
        }

        if (TwingNodeVisitorOptimizer.OPTIMIZE_RAW_FILTER === (TwingNodeVisitorOptimizer.OPTIMIZE_RAW_FILTER & this.optimizers)) {
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
     *   * "echo this.render(Parent)Block()" with "this.display(Parent)Block()"
     *
     * @returns {TwingNode}
     */
    optimizePrintNode(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() !== TwingNodeType.PRINT) {
            return node;
        }

        let exprNode = node.getNode('expr');

        if (exprNode.getType() === TwingNodeType.EXPRESSION_BLOCK_REFERENCE ||
            exprNode.getType() === TwingNodeType.EXPRESSION_PARENT) {
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
        if (node.getType() === TwingNodeType.EXPRESSION_FILTER && node.getNode('filter').getAttribute('value') === 'raw') {
            return node.getNode('node');
        }

        return node;
    }

    /**
     * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
     */
    enterOptimizeFor(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() === TwingNodeType.FOR) {
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
        else if (node.getType() === TwingNodeType.EXPRESSION_NAME && node.getAttribute('name') === 'loop') {
            node.setAttribute('always_defined', true);
            this.addLoopToCurrent();
        }

        // optimize access to loop targets
        else if (node.getType() === TwingNodeType.EXPRESSION_NAME && this.loopsTargets.includes(node.getAttribute('name'))) {
            node.setAttribute('always_defined', true);
        }

        // block reference
        else if (node.getType() === TwingNodeType.BLOCK_REFERENCE || node.getType() === TwingNodeType.EXPRESSION_BLOCK_REFERENCE) {
            this.addLoopToCurrent();
        }

        // include without the only attribute
        else if (node.getType() === TwingNodeType.INCLUDE && !node.getAttribute('only')) {
            this.addLoopToAll();
        }

        // include function without the with_context=false parameter
        else if (node.getType() === TwingNodeType.EXPRESSION_FUNCTION && node.getAttribute('name') === 'include' && (!node.getNode('arguments').hasNode('with_context') || node.getNode('arguments').getNode('with_context').getAttribute('value') !== false)) {
            this.addLoopToAll();
        }

        // the loop variable is referenced via an attribute
        else if (node.getType() === TwingNodeType.EXPRESSION_GET_ATTR && (node.getNode('attribute').getType() !== TwingNodeType.EXPRESSION_CONSTANT || node.getNode('attribute').getAttribute('value') === 'parent') && (this.loops[0].getAttribute('with_loop') === true || (node.getNode('node').getType() === TwingNodeType.EXPRESSION_NAME && node.getNode('node').getAttribute('name') === 'loop'))) {
            this.addLoopToAll();
        }
    }

    /**
     * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
     */
    leaveOptimizeFor(node: TwingNode, env: TwingEnvironment) {
        if (node.getType() === TwingNodeType.FOR) {
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
