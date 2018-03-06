import {TwingNodeExpression} from "../expression";
import {TwingNode, TwingNodeType} from "../../node";
import {TwingMap} from "../../map";
import {TwingCompiler} from "../../compiler";

export abstract class TwingNodeExpressionUnary extends TwingNodeExpression {
    constructor(expr: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', expr);

        super(nodes, new TwingMap(), lineno);

        this.type = TwingNodeType.EXPRESSION_UNARY;
    }

    compile(compiler: TwingCompiler) {
        compiler.raw(' ');
        this.operator(compiler);
        compiler.subcompile(this.getNode('node'));
    }

    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler;
    }
}
