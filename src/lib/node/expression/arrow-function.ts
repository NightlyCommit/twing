import {TwingNodeExpression} from "../expression";
import {TwingCompiler} from "../../compiler";
import {TwingNode} from "../../node";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_arrow_function');

/**
 * Represents an arrow function.
 */
export class TwingNodeExpressionArrowFunction extends TwingNodeExpression {
    constructor(expr: TwingNodeExpression, names: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map([
            ['expr', expr],
            ['names', names]
        ]);

        super(nodes, new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler.raw('async (');

        let i: number = 0;

        for (let [k, name] of this.getNode('names').getNodes()) {
            if (i > 0) {
                compiler.raw(', ');
            }

            compiler
                .raw('$__')
                .raw(name.getAttribute('name'))
                .raw('__');

            i++;
        }

        compiler
            .raw(') => {')
        ;

        for (let [k, name] of this.getNode('names').getNodes()) {
            compiler
                .raw('context.proxy[\'')
                .raw(name.getAttribute('name'))
                .raw('\'] = $__')
                .raw(name.getAttribute('name'))
                .raw('__; ');
        }

        compiler
            .raw('return ')
            .subcompile(this.getNode('expr'))
            .raw(';}');
    }
}
