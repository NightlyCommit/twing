import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeBlock extends TwingNode {
    constructor(
        name: string,
        body: TwingNode,
        lineno: number,
        columnno: number,
        tag: string = null,
        startTrimLeftWhitespaces: boolean = false, // `{%- block
        startTrimRightWhitespaces: boolean = false, // `block -%}`
        endTrimLeftWhitespaces: boolean = false, // `{%- endblock `
        endTrimRightWhitespaces: boolean = false, // `endblock -%}`
    ) {
        const attrs = new Map<string, any>([
            ['name', name],
            ['startTrimLeftWhitespaces', startTrimLeftWhitespaces],
            ['startTrimRightWhitespaces', startTrimRightWhitespaces],
            ['endTrimLeftWhitespaces', endTrimLeftWhitespaces],
            ['endTrimRightWhitespaces', endTrimRightWhitespaces],
        ]);
        super(new Map([['body', body]]), attrs, lineno, columnno, tag);

        this.type = TwingNodeType.BLOCK;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write(`block_${this.getAttribute('name')}(context, blocks = new Map()) {\n`)
            .indent()
        ;

        compiler
            .subcompile(this.getNode('body'))
            .outdent()
            .write("}\n\n")
        ;
    }
}
