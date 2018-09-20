import {TwingNode, TwingNodeType} from "../node";

import {TwingCompiler} from "../compiler";

export class TwingNodeWith extends TwingNode {
    constructor(body: TwingNode, variables: TwingNode, only: boolean, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('body', body);

        if (variables) {
            nodes.set('variables', variables);
        }

        super(nodes, new Map([['only', only]]), lineno, columnno, tag);

        this.type = TwingNodeType.WITH;
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
                .write('throw new Twing.TwingErrorRuntime(\'Variables passed to the "with" tag must be a hash.\', ')
                .repr(this.getTemplateLine())
                .raw(", this.source);\n")
                .outdent()
                .write("}\n")
            ;

            if (this.getAttribute('only')) {
                compiler.write("context = new Map([['_parent', context]]);\n");
            }
            else {
                compiler.write("context.set('_parent', Twing.clone(context));\n");
            }

            compiler.write(`context = Twing.merge(context, Twing.iteratorToMap(${varsName}));\n`);
        }
        else {
            compiler.write("context.set('_parent', Twing.clone(context));\n");
        }

        compiler
            .subcompile(this.getNode('body'))
            .write("context = context.get('_parent');\n")
        ;
    }
}
