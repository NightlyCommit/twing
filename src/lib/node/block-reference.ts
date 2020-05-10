import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('block_reference');

/**
 * Represents a block call node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeBlockReference extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(name: string, lineno: number, columnno: number, tag: string = null) {
        super(new Map(), new Map([['name', name]]), lineno, columnno, tag);

        this.TwingNodeOutputInterfaceImpl = this;
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write(`outputBuffer.echo(await this.traceableRenderBlock(${this.getTemplateLine()}, this.source)('${this.getAttribute('name')}', context.clone(), outputBuffer, blocks));\n`)
        ;
    }
}
