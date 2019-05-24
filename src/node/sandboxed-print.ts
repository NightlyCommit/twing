import {TwingNodePrint} from "./print"
import {TwingCompiler} from "../compiler";

export class TwingNodeSandboxedPrint extends TwingNodePrint {
    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('this.echo(this.env.ensureToStringAllowed(')
            .subcompile(this.getNode('expr'))
            .raw("));\n")
        ;
    }
}
