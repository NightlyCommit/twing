import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('sandbox');

export class TwingNodeSandbox extends TwingNode {
    constructor(body: TwingNode, lineno: number, columnno: number, tag: string = null) {
        super(new Map([['body', body]]), new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write('await (async () => {\n')
            .indent()
            .write('let alreadySandboxed = this.environment.isSandboxed();\n')
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("this.environment.enableSandbox();\n")
            .outdent()
            .write("}\n")
            .subcompile(this.getNode('body'))
            .write("if (!alreadySandboxed) {\n")
            .indent()
            .write("this.environment.disableSandbox();\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write("})();\n")
        ;
    }
}
