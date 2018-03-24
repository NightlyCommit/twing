import {TwingNode, TwingNodeOutputType, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeText extends TwingNode {
    constructor(data: string, line: number) {
        super(new Map(), new Map([['data', data]]), line);

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
