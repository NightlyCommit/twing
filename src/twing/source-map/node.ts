import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingExtensionSourceMap} from "../extension/source-map";

export class TwingSourceMapNode extends TwingNode {
    constructor(node: TwingNode) {
        super(new Map([['node', node]]), new Map(), node.getTemplateLine(), node.getNodeTag());
    }

    compile(compiler: TwingCompiler) {
        let node = this.getNode('node');

        compiler
            .write('this.extensions.get(\'TwingExtensionSourceMap\').log(')
            .raw('this, ')
            .raw(node.getTemplateLine())
            .raw(', ')
            .raw(node.getTemplateColumn())
            .raw(');\n')
        ;
    }
}
