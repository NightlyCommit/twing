import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";

abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(left: TwingNode, right: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('left', left);
        nodes.set('right', right);

        super(nodes, new TwingMap(), lineno);
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('left'))
            .raw(' ')
        ;

        this.operator(compiler);

        compiler
            .raw(' ')
            .subcompile(this.getNode('right'))
            .raw(')')
        ;
    }

    abstract operator(compiler: TwingCompiler): TwingCompiler;
}

export default TwingNodeExpressionBinary;