import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingCompiler from "../compiler";
import TwingNodeOutputType from "../node-output-type";

/**
 * Represents a block call node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingNodeBlockReference extends TwingNode {
    constructor(name: string, lineno: number, tag: string = null) {
        super(new TwingMap(), new TwingMap([['name', name]]), lineno, tag);

        this.type = TwingNodeType.BLOCK_REFERENCE;
        this.outputType = TwingNodeOutputType.OUTPUT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('await ')
            .raw(`this.displayBlock('${this.getAttribute('name')}', context, blocks);\n`)
        ;
    }
}

export default TwingNodeBlockReference;