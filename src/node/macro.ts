/**
 * Represents a macro node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import TwingNode from "../node";
import TwingMap from "../map";
import TwingErrorSyntax from "../error/syntax";
import TwingTemplate = require("../template");
import TwingTemplateBlock from "../template-block";

const VARARGS_NAME = 'varargs';

interface MethodArgument {
    name: string;
    defaultValue: TwingNode;
}

class TwingNodeMacro extends TwingNode {
    constructor(name: string, body: TwingNode, macroArguments: TwingNode, lineno: number, tag: string = null) {
        macroArguments.getNodes().forEach(function (macroArgument, argumentName) {
            if (argumentName === VARARGS_NAME) {
                throw new TwingErrorSyntax(`The argument "${VARARGS_NAME}" in macro "${name}" cannot be defined because the variable "${VARARGS_NAME}" is reserved for arbitrary arguments.`, macroArguments.getTemplateLine());
            }
        });

        let nodes = new TwingMap();

        nodes.set('body', body);
        nodes.set('arguments', macroArguments);

        super(nodes, new TwingMap([['name', name]]), lineno, tag);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let self = this;
        let macroName = 'macro_' + this.getAttribute('name');
        let macroArguments: Array<MethodArgument> = [];

        this.getNode('arguments').getNodes().forEach(function(defaultValue: any, argumentName: string) {
            macroArguments.push({
                name: argumentName,
                defaultValue: defaultValue
            });
        });

        let macro = function (context: any, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap) {
            let output = self.getNode('body').compile(context, template, blocks);

            return output;
        };

        template.setMacro(macroName, {
            macro: macro,
            template: template,
            arguments: macroArguments
        });

        return '';
    }

// phpCompile(compiler: TwingCompiler)
// {
//     compiler
//         .addDebugInfo(this)
// .write(sprintf('public function macro_%s(', this.getAttribute('name')))
// ;
//
//     count = count(this.getNode('arguments'));
//     pos = 0;
//     foreach (this.getNode('arguments') as name => default) {
//     compiler
//         .raw('__'.name.'__ = ')
// .subcompile(default)
//     ;
//
//     if (++pos < count) {
//         compiler.raw(', ');
//     }
// }
//
//     if (count) {
//         compiler.raw(', ');
//     }
//
//     compiler
//         .raw('...__varargs__')
// .raw(")\n")
// .write("{\n")
// .indent()
// ;
//
//     compiler
//         .write("\context = \this.env.mergeGlobals(array(\n")
// .indent()
// ;
//
//     foreach (this.getNode('arguments') as name => default) {
//     compiler
//         .write('')
// .string(name)
// .raw(' => __'.name.'__')
// .raw(",\n")
//     ;
// }
//
//     compiler
//         .write('')
// .string(self::VARARGS_NAME)
// .raw(' => ')
// ;
//
//     compiler
//         .raw("\__varargs__,\n")
// .outdent()
// .write("));\n\n")
// .write("\blocks = array();\n\n")
// .write("ob_start();\n")
// .write("try {\n")
// .indent()
// .subcompile(this.getNode('body'))
// .raw("\n")
// .write("return ('' === \tmp = ob_get_contents()) ? '' : new Twig_Markup(\tmp, \this.env.getCharset());\n")
// .outdent()
// .write("} finally {\n")
// .indent()
// .write("ob_end_clean();\n")
// .outdent()
// .write("}\n")
// .outdent()
// .write("}\n\n")
// ;
// }
}

export default TwingNodeMacro;