import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";
import {TwingNodeOutputInterface} from "../node-output-interface";
import {TwingSourceMapNodeSpaceless} from "../source-map/node/spaceless";

export class TwingNodeSpaceless extends TwingNode implements TwingNodeOutputInterface {
    TwingNodeOutputInterfaceImpl: TwingNodeOutputInterface;

    constructor(body: TwingNode, lineno: number, columnno: number, tag = 'spaceless') {
        let nodes = new Map();

        nodes.set('body', body);

        super(nodes, new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.SPACELESS;

        this.TwingNodeOutputInterfaceImpl = this;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .addSourceMapEnter(this)
            .write("this.startOutputBuffering();\n")
            .subcompile(this.getNode('body'))
            .write("this.echo(this.getAndCleanOutputBuffer().replace(/>\\s+</g, '><').trim());\n")
            .addSourceMapLeave()
        ;
    }
}
