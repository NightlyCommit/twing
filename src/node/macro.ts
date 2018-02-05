/**
 * Represents a macro node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import TwingNode from "../node";
import TwingMap from "../map";
import TwingErrorSyntax from "../error/syntax";
import TwingCompiler from "../compiler";

class TwingNodeMacro extends TwingNode {
    static VARARGS_NAME = 'varargs';

    constructor(name: string, body: TwingNode, macroArguments: TwingNode, lineno: number, tag: string = null) {
        for (let [argumentName, macroArgument] of macroArguments.getNodes()) {
            if (argumentName === TwingNodeMacro.VARARGS_NAME) {
                throw new TwingErrorSyntax(`The argument "${TwingNodeMacro.VARARGS_NAME}" in macro "${name}" cannot be defined because the variable "${TwingNodeMacro.VARARGS_NAME}" is reserved for arbitrary arguments.`, macroArgument.getTemplateLine());
            }
        }

        let nodes = new TwingMap();

        nodes.set('body', body);
        nodes.set('arguments', macroArguments);

        super(nodes, new TwingMap([['name', name]]), lineno, tag);
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write(`macro_${this.getAttribute('name')}(`)
        ;

        let count = this.getNode('arguments').getNodes().size;
        let pos = 0;

        for (let [name, default_] of this.getNode('arguments').getNodes()) {
            compiler
                .raw('__' + name + '__ = ')
                .subcompile(default_)
            ;

            if (++pos < count) {
                compiler.raw(', ');
            }
        }

        if (count) {
            compiler.raw(', ');
        }

        compiler
            .raw('...__varargs__')
            .raw(") {\n")
            .indent()
        ;

        compiler
            .write("let context = this.env.mergeGlobals(new Twing.TwingMap([\n")
            .indent()
        ;

        let first = true;

        for (let [name, default_] of this.getNode('arguments').getNodes()) {
            if (!first) {
                compiler.raw(',\n');
            }

            first = false;

            compiler
                .write('[')
                .string(name)
                .raw(', __' + name + '__]')
            ;
        }

        if (!first) {
            compiler.raw(',\n');
        }

        compiler
            .write('[')
            .string(TwingNodeMacro.VARARGS_NAME)
            .raw(', ')
        ;

        compiler
            .raw("\__varargs__]\n")
            .outdent()
            .write("]));\n\n")
            .write("let blocks = new Twing.TwingMap();\n")
            .write('let result;\n')
            .write('let error;\n\n')
            .write("Twing.obStart();\n")
            .write("try {\n")
            .indent()
            .subcompile(this.getNode('body'))
            .raw("\n")
            .write('let tmp = Twing.obGetContents();\n')
            .write("result = (tmp === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset());\n")
            .outdent()
            .write("}\n")
            .write('catch (e) {\n')
            .indent()
            .write('error = e;\n')
            .outdent()
            .write('}\n\n')
            .write("Twing.obEndClean();\n\n")
            .write('if (error) {\n')
            .indent()
            .write('throw error;\n')
            .outdent()
            .write('}\n')
            .write('return result;\n')
            .outdent()
            .write("}\n\n")
        ;
    }
}

export default TwingNodeMacro;