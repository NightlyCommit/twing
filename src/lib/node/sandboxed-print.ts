import {TwingNodePrint} from "./print"
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('sandboxed_print');

export class TwingNodeSandboxedPrint extends TwingNodePrint {
    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write('outputBuffer.echo(this.environment.ensureToStringAllowed(')
            .subcompile(this.getNode('expr'))
            .raw("));\n")
        ;
    }
}
