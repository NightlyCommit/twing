import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingExtensionSourceMap} from "../extension/source-map";

export class TwingSourceMapNode2 extends TwingNode {
    constructor(node: TwingNode) {
        super(new Map([['node', node]]), new Map());
    }

    compile(compiler: TwingCompiler) {
        let node = this.getNode('node');

        // compiler
        //     .write('(this.extensions.get(\'TwingExtensionSourceMap\').startUof(')
        //     .raw('this, ')
        //     .raw(node.getTemplateLine())
        //     .raw(', ')
        //     .raw(node.getTemplateColumn())
        //     .raw(')),')
        // ;

        compiler
            .raw('\n')
            .outdent()
            .raw('})(), true)\n')
        ;
    }
}
