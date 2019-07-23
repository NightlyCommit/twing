import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeBlock extends TwingNode {
    constructor(name: string, body: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['body', body]]), new Map([['name', name]]), lineno, columnno, tag);

        this.type = TwingNodeType.BLOCK;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write(`block_${this.getAttribute('name')}(context, blocks = new Map()) {\n`)
            .indent()
            .write('let macros = this.macros.clone();\n')
        ;

        compiler
            .subcompile(this.getNode('body'))
            .outdent()
            .write("}\n\n")
        ;
    }
}
