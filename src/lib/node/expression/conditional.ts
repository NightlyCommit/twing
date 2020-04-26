import {TwingNodeExpression} from "../expression";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_conditional');

export class TwingNodeExpressionConditional extends TwingNodeExpression {
    constructor(expr1: TwingNodeExpression, expr2: TwingNodeExpression, expr3: TwingNodeExpression, lineno: number, columnno: number) {
        let nodes = new Map();

        nodes.set('expr1', expr1);
        nodes.set('expr2', expr2);
        nodes.set('expr3', expr3);

        super(nodes, new Map(), lineno, columnno);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('((')
            .subcompile(this.getNode('expr1'))
            .raw(') ? (')
            .subcompile(this.getNode('expr2'))
            .raw(') : (')
            .subcompile(this.getNode('expr3'))
            .raw('))')
        ;
    }
}
