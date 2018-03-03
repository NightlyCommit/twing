import {TwingNode} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";

export class TwingNodeWith extends TwingNode {
    constructor(body: TwingNode, variables: TwingNode = null, only: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('body', body);

        if (variables) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only]]), lineno, tag);
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);

        if (this.hasNode('variables')) {
            let varsName = compiler.getVarName();

            compiler
                .write(`let ${varsName} = `)
                .subcompile(this.getNode('variables'))
                .raw(";\n")
                .write(`if (typeof (${varsName}) !== 'object') {\n`)
                .indent()
                .write('throw new Twing.TwingErrorRuntime(\'Variables passed to the "with" tag must be a hash.\', this);\n')
                .outdent()
                .write("}\n")
            ;

            if (this.getAttribute('only')) {
                compiler.write("context = new Twing.TwingMap([['_parent', context]]);\n");
            }
            else {
                compiler.write("context.set('_parent', context.clone());\n");
            }

            compiler.write(`context = context.merge(Twing.iteratorToMap(${varsName}));\n`);
        }
        else {
            compiler.write("context.set('_parent', context.clone());\n");
        }

        compiler
            .subcompile(this.getNode('body'))
            .write("context = context.get('_parent');\n")
        ;
    }
}
