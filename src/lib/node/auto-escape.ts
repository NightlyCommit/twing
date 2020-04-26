import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('auto_escape');

/**
 * Represents an autoescape node.
 *
 * The value is the escaping strategy (can be html, js, ...)
 *
 * The true value is equivalent to html.
 *
 * If autoescaping is disabled, then the value is false.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeAutoEscape extends TwingNode {
    constructor(value: {}, body: TwingNode, lineno: number, columnno: number, tag = 'autoescape') {
        super(new Map([['body', body]]), new Map([['value', value]]), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('body'));
    }
}
