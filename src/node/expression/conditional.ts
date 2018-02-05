import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionConditional extends TwingNodeExpression {
    constructor(expr1: TwingNodeExpression, expr2: TwingNodeExpression, expr3: TwingNodeExpression, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('expr1', expr1);
        nodes.set('expr2', expr2);
        nodes.set('expr3', expr3);

        super(nodes, new TwingMap(), lineno);
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

export default TwingNodeExpressionConditional;