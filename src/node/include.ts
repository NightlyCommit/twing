import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingCompiler from "../compiler";

class TwingNodeInclude extends TwingNode {
    constructor(expr: TwingNodeExpression, variables: TwingNodeExpression = null, only: boolean = false, ignoreMissing: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        if (variables !== null) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only], ['ignore_missing', ignoreMissing]]), lineno, tag);
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);

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
                .write("} catch (e) {\n")
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
            compiler.raw(this.getAttribute('only') === false ? 'context' : 'new Twing.TwingMap()');
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

export default TwingNodeInclude;