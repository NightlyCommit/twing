import {TwingNodePrint} from "./print"
import {TwingCompiler} from "../compiler";

export class TwingNodeSandboxedPrint extends TwingNodePrint {
    compile(compiler: TwingCompiler) {
        compiler
            .write('this.echo(this.extensions.get(\'TwingExtensionSandbox\').ensureToStringAllowed(')
            .subcompile(this.getNode('expr'))
            .raw("));\n")
        ;
    }
}
