import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeSpaceless extends TwingNode {
    constructor(body: TwingNode, lineno: number, columnno: number, tag = 'spaceless') {
        let nodes = new Map();

        nodes.set('body', body);

        super(nodes, new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.SPACELESS;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("Twing.obStart();\n")
            .subcompile(this.getNode('body'))
            .write("Twing.echo(Twing.obGetClean().replace(/>\\s+</g, '><').trim());\n")
        ;
    }
}
