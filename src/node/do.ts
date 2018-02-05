import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";

/**
 * Represents a do node.
 *
 * The do tag works exactly like the regular variable expression ({{ ... }}) just that it doesn't print anything:
 * {% do 1 + 2 %}
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric Morand <eric.morand@gmail.com>
 */
class TwingNodeDo extends TwingNode {
    constructor(expr: TwingNodeExpression, lineno: number, tag: string = null) {
        super(new TwingMap([['expr', expr]]), new TwingMap(), lineno, tag);
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('')
            .subcompile(this.getNode('expr'))
            .raw(";\n")
        ;
    }
}

export default TwingNodeDo;