import {TwingNodeExpression} from "../expression";
import {TwingNode} from "../../node";
import {TwingCompiler} from "../../compiler";

export abstract class TwingNodeExpressionUnary extends TwingNodeExpression {
    constructor(expr: TwingNode, lineno: number, columno: number) {
        let nodes = new Map();

        nodes.set('node', expr);

        super(nodes, new Map(), lineno, columno);
    }

    compile(compiler: TwingCompiler) {
        this.operator(compiler);

        compiler
            .raw('(')
            .subcompile(this.getNode('node'))
            .raw(')');
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler;
    }
}
