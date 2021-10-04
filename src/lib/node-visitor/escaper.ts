import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNode} from "../node";
import {TwingEnvironment} from "../environment";
import {TwingNodeVisitorSafeAnalysis} from "./safe-analysis";
import {TwingNodeTraverser} from "../node-traverser";
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNodeExpression} from "../node/expression";
import {TwingNodeExpressionFilter} from "../node/expression/filter";
import {TwingNodePrint} from "../node/print";
import {TwingNodeDo} from "../node/do";
import {TwingNodeExpressionConditional} from "../node/expression/conditional";
import {TwingNodeInlinePrint} from "../node/inline-print";
import {type as moduleType} from "../node/module";
import {type as autoEscapeType} from "../node/auto-escape";
import {type as blockType} from "../node/block";
import {type as blockReferenceType} from "../node/block-reference";
import {type as importType} from "../node/import";
import {type as printType} from "../node/print";
import {type as filterType} from "../node/expression/filter";
import {type as conditionalType} from "../node/expression/conditional";

export class TwingNodeVisitorEscaper extends TwingBaseNodeVisitor {
    private statusStack: Array<TwingNode | string | false> = [];
    private blocks: Map<string, any> = new Map();
    private safeAnalysis: TwingNodeVisitorSafeAnalysis;
    private traverser: TwingNodeTraverser;
    private defaultStrategy: string | false = false;
    private safeVars: Array<TwingNode> = [];

    constructor() {
        super();

        this.TwingNodeVisitorInterfaceImpl = this;

        this.safeAnalysis = new TwingNodeVisitorSafeAnalysis();
    }

    protected doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.is(moduleType)) {
            this.defaultStrategy = env.getCoreExtension().getDefaultStrategy(node.getTemplateName());
            this.safeVars = [];
            this.blocks = new Map();
        } else if (node.is(autoEscapeType)) {
            this.statusStack.push(node.getAttribute('value'));
        } else if (node.is(blockType)) {
            this.statusStack.push(this.blocks.has(node.getAttribute('name')) ? this.blocks.get(node.getAttribute('name')) : this.needEscaping());
        } else if (node.is(importType)) {
            this.safeVars.push(node.getNode('var').getAttribute('name'));
        }

        return node;
    }

    protected doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode {
        if (node.is(moduleType)) {
            this.defaultStrategy = false;
            this.safeVars = [];
            this.blocks = new Map();
        } else if (node.is(filterType)) {
            return this.preEscapeFilterNode(node as TwingNodeExpressionFilter, env);
        } else if (node.is(printType)) {
            let type = this.needEscaping();

            if (type !== false) {
                let expression: TwingNodeExpression = node.getNode('expr');

                if ((expression.is(conditionalType)) && this.shouldUnwrapConditional(expression, env, type)) {
                    return new TwingNodeDo(this.unwrapConditional(expression, env, type), expression.getTemplateLine(), expression.getTemplateColumn());
                }

                return this.escapePrintNode(node as any, env, type);
            }
        }

        if (node.is(autoEscapeType) || node.is(blockType)) {
            this.statusStack.pop();
        } else if (node.is(blockReferenceType)) {
            this.blocks.set(node.getAttribute('name'), this.needEscaping());
        }

        return node;
    }

    private shouldUnwrapConditional(expression: TwingNodeExpressionConditional, env: TwingEnvironment, type: any) {
        let expr2Safe = this.isSafeFor(type, expression.getNode('expr2'), env);
        let expr3Safe = this.isSafeFor(type, expression.getNode('expr3'), env);

        return expr2Safe !== expr3Safe;
    }

    private unwrapConditional(expression: TwingNodeExpressionConditional, env: TwingEnvironment, type: any): TwingNodeExpressionConditional {
        // convert "echo a ? b : c" to "a ? echo b : echo c" recursively
        let expr2: TwingNodeExpression = expression.getNode('expr2');

        if ((expr2.is(conditionalType)) && this.shouldUnwrapConditional(expr2, env, type)) {
            expr2 = this.unwrapConditional(expr2, env, type);
        } else {
            expr2 = this.escapeInlinePrintNode(new TwingNodeInlinePrint(expr2, expr2.getTemplateLine(), expr2.getTemplateColumn()), env, type);
        }

        let expr3: TwingNodeExpression = expression.getNode('expr3');

        if ((expr3.is(conditionalType)) && this.shouldUnwrapConditional(expr3, env, type)) {
            expr3 = this.unwrapConditional(expr3, env, type);
        } else {
            expr3 = this.escapeInlinePrintNode(new TwingNodeInlinePrint(expr3, expr3.getTemplateLine(), expr3.getTemplateColumn()), env, type);
        }

        return new TwingNodeExpressionConditional(expression.getNode('expr1'), expr2, expr3, expression.getTemplateLine(), expression.getTemplateColumn());
    }

    private escapeInlinePrintNode(node: TwingNodeInlinePrint, env: TwingEnvironment, type: any): TwingNode {
        let expression: TwingNode = node.getNode('node');

        if (this.isSafeFor(type, expression, env)) {
            return node;
        }

        return new TwingNodeInlinePrint(this.getEscaperFilter(type, expression), node.getTemplateLine(), node.getTemplateColumn());
    }

    private escapePrintNode(node: TwingNodePrint, env: TwingEnvironment, type: any) {
        let expression = node.getNode('expr');

        if (this.isSafeFor(type, expression, env)) {
            return node;
        }

        return new TwingNodePrint(this.getEscaperFilter(type, expression), node.getTemplateLine(), node.getTemplateColumn());
    }

    private preEscapeFilterNode(filterNode: TwingNodeExpressionFilter, env: TwingEnvironment) {
        let name = filterNode.getNode('filter').getAttribute('value');

        const filter = env.getFilter(name);

        if (!filter) {
            return filterNode;
        }

        let type = env.getFilter(name).getPreEscape();

        if (type === null) {
            return filterNode;
        }

        let node = filterNode.getNode('node');

        if (this.isSafeFor(type, node, env)) {
            return filterNode;
        }

        filterNode.setNode('node', this.getEscaperFilter(type, node));

        return filterNode;
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
     * @returns string | Function | false
     */
    private needEscaping() {
        if (this.statusStack.length) {
            return this.statusStack[this.statusStack.length - 1];
        }

        return this.defaultStrategy ? this.defaultStrategy : false;
    }

    private getEscaperFilter(type: any, node: TwingNode) {
        let line = node.getTemplateLine();
        let column = node.getTemplateColumn();

        let nodes = new Map();

        let name = new TwingNodeExpressionConstant('escape', line, column);

        nodes.set(0, new TwingNodeExpressionConstant(type, line, column));
        nodes.set(1, new TwingNodeExpressionConstant(null, line, column));
        nodes.set(2, new TwingNodeExpressionConstant(true, line, column));

        let nodeArgs = new TwingNode(nodes);

        return new TwingNodeExpressionFilter(node, name, nodeArgs, line, column);
    }

    public getPriority() {
        return 0;
    }
}
