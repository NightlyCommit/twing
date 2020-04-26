import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('auto_escape');

export class TwingNodeBlock extends TwingNode {
    constructor(name: string, body: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['body', body]]), new Map([['name', name]]), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw(`async (context, outputBuffer, blocks = new Map()) => {\n`)
            .indent()
            .write('let aliases = this.aliases.clone();\n')
        ;

        compiler
            .subcompile(this.getNode('body'))
            .outdent()
            .write("}")
        ;
    }
}
