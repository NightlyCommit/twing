import {TwingNode} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

/**
 * Represents an autoescape node.
 *
 * The value is the escaping strategy (can be html, js, ...)
 *
 * The true value is equivalent to html.
 *
 * If autoescaping is disabled, then the value is false.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingNodeAutoEscape extends TwingNode {
    constructor(value: {}, body: TwingNode, lineno: number, tag = 'autoescape') {
        super(new TwingMap([['body', body]]), new TwingMap([['value', value]]), lineno, tag);

        this.type = TwingNodeType.AUTO_ESCAPE;
    }

    compile(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('body'));
    }
}
