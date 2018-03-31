import {TwingNodePrint} from "./print"
import {TwingCompiler} from "../compiler";
import {TwingNode, TwingNodeType} from "../node";

export class TwingNodeSandboxedPrint extends TwingNodePrint {
    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('Twing.echo(this.env.getExtension(\'TwingExtensionSandbox\').ensureToStringAllowed(')
            .subcompile(this.getNode('expr'))
            .raw("));\n")
        ;
    }

    // unit: not coverable, it's private and never used there
    // /**
    //  * Removes node filters.
    //  *
    //  * This is mostly needed when another visitor adds filters (like the escaper one).
    //  *
    //  * @returns {TwingNode}
    //  */
    // private removeNodeFilter(node: TwingNode): TwingNode {
    //     if (node.getType() === TwingNodeType.EXPRESSION_FILTER) {
    //         return this.removeNodeFilter(node.getNode('node'));
    //     }
    //
    //     return node;
    // }
}
