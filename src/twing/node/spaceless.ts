import {TwingNode} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export class TwingNodeSpaceless extends TwingNode {
    constructor(body: TwingNode, lineno: number, tag = 'spaceless') {
        let nodes = new TwingMap();

        nodes.set('body', body);

        super(nodes, new TwingMap(), lineno, tag);

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
