import {TwingNodeExpression} from "../expression";
import {TwingNode, TwingNodeType} from "../../node";

import {TwingCompiler} from "../../compiler";

export abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(left: TwingNode, right: TwingNode, lineno: number, columno: number) {
        let nodes = new Map();

        nodes.set('left', left);
        nodes.set('right', right);

        super(nodes, new Map(), lineno, columno);

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
