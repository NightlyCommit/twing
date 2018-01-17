import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

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

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let exprHandler = compiler.subcompile(this.getNode('expr'));

        return (template: TwingTemplate, context: any, blocks: any) => {
            exprHandler(template, context, blocks);
        }
    }
}

export default TwingNodeDo;