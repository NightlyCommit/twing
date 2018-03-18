import {TwingNode, TwingNodeType} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";

export class TwingNodeSandbox extends TwingNode {
    constructor(body: TwingNode, lineno: number, tag: string = null) {
        super(new TwingMap([['body', body]]), new TwingMap(), lineno, tag);

        this.type = TwingNodeType.SANDBOX;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("(")
            .raw("() => {\n")
            .indent()
            .write("let sandbox = this.env.getExtension('TwingExtensionSandbox');\n")
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
