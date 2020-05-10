/**
 * Represents a macro node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingNode} from "../node";
import {TwingErrorSyntax} from "../error/syntax";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('macro');

export class TwingNodeMacro extends TwingNode {
    static VARARGS_NAME = 'varargs';

    constructor(name: string, body: TwingNode, macroArguments: TwingNode, lineno: number, columnno: number, tag: string = null) {
        for (let [argumentName, macroArgument] of macroArguments.getNodes()) {
            if (argumentName === TwingNodeMacro.VARARGS_NAME) {
                throw new TwingErrorSyntax(`The argument "${TwingNodeMacro.VARARGS_NAME}" in macro "${name}" cannot be defined because the variable "${TwingNodeMacro.VARARGS_NAME}" is reserved for arbitrary arguments.`, macroArgument.getTemplateLine());
            }
        }

        let nodes = new Map();

        nodes.set('body', body);
        nodes.set('arguments', macroArguments);

        super(nodes, new Map([['name', name]]), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw(`async (`)
            .raw('outputBuffer, ')
        ;

        let count = this.getNode('arguments').getNodes().size;
        let pos = 0;

        for (let [name, defaultValue] of this.getNode('arguments').getNodes()) {
            compiler
                .raw('__' + name + '__ = ')
                .subcompile(defaultValue)
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
            .raw(") => {\n")
            .indent()
            .write('let aliases = this.aliases.clone();\n')
            .write("let context = new this.Context(this.environment.mergeGlobals(new Map([\n")
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
                .string(name as string)
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
            .write("])));\n\n")
            .write("let blocks = new Map();\n")
            .write('let result;\n')
            .write('let error;\n\n')
            .write("outputBuffer.start();\n")
            .write("try {\n")
            .indent()
            .subcompile(this.getNode('body'))
            .raw("\n")
            .write('let tmp = outputBuffer.getContents();\n')
            .write("result = (tmp === '') ? '' : new this.Markup(tmp, this.environment.getCharset());\n")
            .outdent()
            .write("}\n")
            .write('catch (e) {\n')
            .indent()
            .write('error = e;\n')
            .outdent()
            .write('}\n\n')
            .write("outputBuffer.endAndClean();\n\n")
            .write('if (error) {\n')
            .indent()
            .write('throw error;\n')
            .outdent()
            .write('}\n')
            .write('return result;\n')
            .outdent()
            .write("}")
        ;
    }
}
