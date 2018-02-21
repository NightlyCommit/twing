import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import TwingNodeType from "../../node-type";

abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(left: TwingNode, right: TwingNode, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('left', left);
        nodes.set('right', right);

        super(nodes, new TwingMap(), lineno);

        this.type = TwingNodeType.EXPRESSION_BINARY;
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

    /**
     *
     * @param {TwingCompiler} compiler
     * @returns {TwingCompiler}
     */
    operator(compiler: TwingCompiler): TwingCompiler {
        return compiler;
    }
}

export default TwingNodeExpressionBinary;