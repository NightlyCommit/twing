import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";
import {TwingCompiler} from "../compiler";

export class TwingNodeInclude extends TwingNode {
    constructor(expr: TwingNodeExpression, variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('expr', expr);

        if (variables !== null) {
            nodes.set('variables', variables);
        }

        super(nodes, new Map([['only', only], ['ignore_missing', ignoreMissing]]), lineno, columnno, tag);

        this.type = TwingNodeType.INCLUDE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .addSourceMapEnter(this)
        ;

        if (this.getAttribute('ignore_missing')) {
            compiler
                .write("try {\n")
                .indent()
            ;
        }

        this.addGetTemplate(compiler);

        compiler.raw('.display(');

        this.addTemplateArguments(compiler);

        compiler.raw(");\n");

        if (this.getAttribute('ignore_missing')) {
            compiler
                .outdent()
                .write("}\n")
                .write("catch (e) {\n")
                .indent()
                .write('if (e instanceof Twing.TwingErrorLoader) {\n')
                .indent()
                .write("// ignore missing template\n")
                .outdent()
                .write('}\n')
                .write('else {\n')
                .indent()
                .write('throw e;\n')
                .outdent()
                .write('}\n')
                .outdent()
                .write("}\n\n")
            ;
        }

        compiler.addSourceMapLeave();
    }

    addGetTemplate(compiler: TwingCompiler) {
        compiler
            .write('this.loadTemplate(')
            .subcompile(this.getNode('expr'))
            .raw(', ')
            .repr(this.getTemplateName())
            .raw(', ')
            .repr(this.getTemplateLine())
            .raw(')')
        ;
    }

    addTemplateArguments(compiler: TwingCompiler) {
        if (!this.hasNode('variables')) {
            compiler.raw(this.getAttribute('only') === false ? 'context' : 'new Map()');
        }
        else if (this.getAttribute('only') === false) {
            compiler
                .raw('Twing.twingArrayMerge(context, ')
                .subcompile(this.getNode('variables'))
                .raw(')')
            ;
        }
        else {
            compiler.subcompile(this.getNode('variables'));
        }
    }
}
