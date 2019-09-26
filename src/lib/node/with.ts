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
        if (this.hasNode('variables')) {
            let varsName = compiler.getVarName();

            compiler
                .write(`let ${varsName} = `)
                .subcompile(this.getNode('variables'))
                .raw(";\n")
                .write(`if (typeof (${varsName}) !== 'object') {\n`)
                .indent()
                .write('throw new this.RuntimeError(\'Variables passed to the "with" tag must be a hash.\', ')
                .repr(this.getTemplateLine())
                .raw(", this.source);\n")
                .outdent()
                .write("}\n")
            ;

            if (this.getAttribute('only')) {
                compiler.write("context = new Map([['_parent', context]]);\n");
            }
            else {
                compiler.write("context.set('_parent', context.clone());\n");
            }

            compiler.write(`context = new this.Context(this.env.mergeGlobals(this.merge(context, this.convertToMap(${varsName}))));\n`);
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
