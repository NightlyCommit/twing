import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";

/**
 * Represents a block call node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingNodeBlockReference extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(name: string, lineno: number, columnno: number, tag: string = null) {
        super(new Map(), new Map([['name', name]]), lineno, columnno, tag);

        this.type = TwingNodeType.BLOCK_REFERENCE;

        this.TwingNodeOutputInterfaceImpl = this;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write(`this.traceableDisplayBlock(${this.getTemplateLine()}, this.source)('${this.getAttribute('name')}', context.clone(), blocks);\n`)
        ;
    }
}
