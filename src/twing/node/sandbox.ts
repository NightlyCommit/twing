import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeSandbox extends TwingNode {
    constructor(body: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['body', body]]), new Map(), lineno, columnno, tag);

        this.type = TwingNodeType.SANDBOX;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("(")
            .raw("() => {\n")
            .indent()
            .write("let sandbox = this.extensions.get('TwingExtensionSandbox');\n")
            .write('let alreadySandboxed = sandbox.isSandboxed();\n')
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("sandbox.enableSandbox();\n")
            .outdent()
            .write("}\n")
            .subcompile(this.getNode('body'))
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("sandbox.disableSandbox();\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write("})();\n")
        ;
    }
}
