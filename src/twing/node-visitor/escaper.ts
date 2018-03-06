import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode, TwingNodeType} from "../node";
import {TwingEnvironment} from "../environment";
import {TwingNodeVisitorSafeAnalysis} from "./safe-analysis";
import {TwingNodeTraverser} from "../node-traverser";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingMap} from "../map";
import {TwingNodeExpressionFilter} from "../node/expression/filter";
import {TwingNodePrint} from "../node/print";

export class TwingNodeVisitorEscaper extends TwingBaseNodeVisitor {
    private statusStack: Array<TwingNode | string | false> = [];
    private blocks: Map<string, any> = new Map();
    private safeAnalysis: TwingNodeVisitorSafeAnalysis;
    private traverser: TwingNodeTraverser;
    private defaultStrategy: string | Function | false = false;
    private safeVars: Array<TwingNode> = [];

    constructor() {
        super();

        this.safeAnalysis = new TwingNodeVisitorSafeAnalysis();
    }

    doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.getType() === TwingNodeType.MODULE) {
            if (env.hasExtension('TwingExtensionEscaper')) {
                this.defaultStrategy = env.getExtension('TwingExtensionEscaper').getDefaultStrategy(node.getTemplateName());
            }

            this.safeVars = [];
            this.blocks = new Map();
        }
        else if (node.getType() === TwingNodeType.AUTO_ESCAPE) {
            this.statusStack.push(node.getAttribute('value'));
        }
        else if (node.getType() === TwingNodeType.BLOCK) {
            this.statusStack.push(this.blocks.has(node.getAttribute('name')) ? this.blocks.get(node.getAttribute('name')) : this.needEscaping(env));
        }
        else if (node.getType() === TwingNodeType.IMPORT) {
            this.safeVars.push(node.getNode('var').getAttribute('name'));
        }

        return node;
    }

    doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        // @see https://github.com/Microsoft/TypeScript/issues/10422
        if (node.getType() === TwingNodeType.MODULE) {
            this.defaultStrategy = false;
            this.safeVars = [];
            this.blocks = new Map();
        }
        else if (node.getType() === TwingNodeType.EXPRESSION_FILTER) {
            return this.preEscapeFilterNode(node as TwingNodeExpressionFilter, env);
        }
        else if (node.getType() === TwingNodeType.PRINT) {
            return this.escapePrintNode(node, env, this.needEscaping(env));
        }

        if (node.getType() === TwingNodeType.AUTO_ESCAPE || node.getType() === TwingNodeType.BLOCK) {
            this.statusStack.pop();
        }
        else if (node.getType() === TwingNodeType.BLOCK_REFERENCE) {
            this.blocks.set(node.getAttribute('name'), this.needEscaping(env));
        }

        return node;
    }

    private escapePrintNode(node: TwingNodePrint, env: TwingEnvironment, type: any) {
        if (!type) {
            return node;
        }

        let expression = node.getNode('expr');

        if (this.isSafeFor(type, expression, env)) {
            return node;
        }

        return new TwingNodePrint(this.getEscaperFilter(type, expression), node.getTemplateLine());
    }

    private preEscapeFilterNode(filter: TwingNodeExpressionFilter, env: TwingEnvironment) {
        let name = filter.getNode('filter').getAttribute('value');

        let type = env.getFilter(name).getPreEscape();

        if (type === null) {
            return filter;
        }

        let node = filter.getNode('node');

        if (this.isSafeFor(type, node, env)) {
            return filter;
        }

        filter.setNode('node', this.getEscaperFilter(type, node));

        return filter;
    }

    private isSafeFor(type: TwingNode | string | false, expression: TwingNode, env: TwingEnvironment) {
        let safe = this.safeAnalysis.getSafe(expression);

        if (!safe) {
            if (!this.traverser) {
                this.traverser = new TwingNodeTraverser(env, [this.safeAnalysis]);
            }

            this.safeAnalysis.setSafeVars(this.safeVars);

            this.traverser.traverse(expression);

            safe = this.safeAnalysis.getSafe(expression);
        }

        return (safe.includes(type)) || (safe.includes('all'));
    }

    /**
     *
     * @param {TwingEnvironment} env
     * @returns string | Function | false
     */
    needEscaping(env: TwingEnvironment) {
        if (this.statusStack.length) {
            return this.statusStack[this.statusStack.length - 1];
        }

        return this.defaultStrategy ? this.defaultStrategy : false;
    }

    private getEscaperFilter(type: any, node: TwingNode) {
        let line = node.getTemplateLine();

        let nodes = new TwingMap();

        let name = new TwingNodeExpressionConstant('escape', line);

        nodes.push(new TwingNodeExpressionConstant(type, line));
        nodes.push(new TwingNodeExpressionConstant(null, line));
        nodes.push(new TwingNodeExpressionConstant(true, line));

        let nodeArgs = new TwingNode(nodes);

        return new TwingNodeExpressionFilter(node, name, nodeArgs, line);
    }

    getPriority() {
        return 0;
    }
}
