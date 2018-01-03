import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate = require("../template");

class TwingNodeWith extends TwingNode {
    constructor(body: TwingNode, variables: TwingNode = null, only: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('body', body);

        if (variables) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only]]), lineno, tag);
    }

    // phpCompile(compiler: TwingCompiler) {
    //     compiler.addDebugInfo(this);
    //
    //     if (this.hasNode('variables')) {
    //         let varsName = compiler.getVarName();
    //         compiler
    //             .write(`$${varsName} = `)
    //             .subcompile(this.getNode('variables'))
    //             .raw(";\n")
    //             .write(`if (!is_array(\$${varsName})) {\n`)
    //             .indent()
    //             .write("throw new TwingErrorRuntime('Variables passed to the \"with\" tag must be a hash.');\n")
    //             .outdent()
    //             .write("}\n")
    //         ;
    //
    //         if (this.getAttribute('only')) {
    //             compiler.write("\$context = array('_parent' => \$context);\n");
    //         }
    //         else {
    //             compiler.write("\$context['_parent'] = \$context;\n");
    //         }
    //
    //         compiler.write(`\$context = array_merge(\$context, \$${varsName});\n`);
    //     } else {
    //         compiler.write("\$context['_parent'] = \$context;\n");
    //     }
    //
    //     compiler
    //         .subcompile(this.getNode('body'))
    //         .write("\$context = \$context['_parent'];\n")
    //     ;
    // }

    compile(context: any, template: TwingTemplate): any {
        return 'WITH';
    }
}

export default TwingNodeWith;