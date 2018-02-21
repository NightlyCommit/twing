import TwingNodePrint from "./print"
import TwingCompiler from "../compiler";
import TwingNode from "../node";
import TwingNodeExpressionFilter from "./expression/filter";
import TwingNodeType from "../node-type";

class TwingNodeSandboxedPrint extends TwingNodePrint {
    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write('Twing.echo(this.env.getExtension(\'TwingExtensionSandbox\').ensureToStringAllowed(')
            .subcompile(this.getNode('expr'))
            .raw("));\n")
        ;
    }

    /**
     * Removes node filters.
     *
     * This is mostly needed when another visitor adds filters (like the escaper one).
     *
     * @returns {TwingNode}
     */
    private removeNodeFilter(node: TwingNode): TwingNode {
        if (node.getType() === TwingNodeType.EXPRESSION_FILTER) {
            return this.removeNodeFilter(node.getNode('node'));
        }

        return node;
    }
}

export default TwingNodeSandboxedPrint;