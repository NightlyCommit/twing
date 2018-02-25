import {TwingNode} from "../node";
import {TwingNodeType} from "../node-type";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeOutputType} from "../node-output-type";

export class TwingNodeText extends TwingNode {
    constructor(data: string, line: number) {
        super(new TwingMap(), new TwingMap([['data', data]]), line);

        this.type = TwingNodeType.TEXT;
        this.outputType = TwingNodeOutputType.OUTPUT;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('Twing.echo(')
            .string(this.getAttribute('data'))
            .raw(");\n")
        ;
    }
}
