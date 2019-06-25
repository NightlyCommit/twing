import {TwingNodeExpression} from "../expression";
import {TwingNode, TwingNodeType} from "../../node";

import {TwingCompiler} from "../../compiler";

export abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
    constructor(nodes: [TwingNode, TwingNode], lineno: number, columno: number) {
        super(new Map([
            ['left', nodes[0]],
            ['right', nodes[1]]
        ]), new Map(), lineno, columno);

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
