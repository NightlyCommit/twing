import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeSandbox extends TwingNode {
    constructor(body: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['body', body]]), new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.SANDBOX;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("(")
            .raw("() => {\n")
            .indent()
            .write('let alreadySandboxed = this.sandbox.isSandboxed();\n')
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("this.sandbox.enableSandbox();\n")
            .outdent()
            .write("}\n")
            .subcompile(this.getNode('body'))
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("this.sandbox.disableSandbox();\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write("})();\n")
        ;
    }
}
