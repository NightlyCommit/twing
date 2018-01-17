/**
 * Represents a macro node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import TwingNode from "../node";
import TwingMap from "../map";
import TwingErrorSyntax from "../error/syntax";
import TwingTemplate from "../template";
import TwingMarkup from "../markup";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";
import TwingMethodArgument from "../method-argument";

const VARARGS_NAME = 'varargs';

class TwingNodeMacro extends TwingNode {
    constructor(name: string, body: TwingNode, macroArguments: TwingNode, lineno: number, tag: string = null) {
        macroArguments.getNodes().forEach(function (macroArgument, argumentName) {
            if (argumentName === VARARGS_NAME) {
                throw new TwingErrorSyntax(`The argument "${VARARGS_NAME}" in macro "${name}" cannot be defined because the variable "${VARARGS_NAME}" is reserved for arbitrary arguments.`, macroArgument.getTemplateLine());
            }
        });

        let nodes = new TwingMap();

        nodes.set('body', body);
        nodes.set('arguments', macroArguments);

        super(nodes, new TwingMap([['name', name]]), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let bodyHandler = compiler.subcompile(this.getNode('body'));
        let macroName = this.getAttribute('name');
        let macroArguments: Array<TwingMethodArgument> = [];
        let environment = compiler.getEnvironment();
        let charset = environment.getCharset();

        for (let [argumentName, defaultValue] of this.getNode('arguments').getNodes()) {
            macroArguments.push({
                name: argumentName,
                defaultValue: compiler.subcompile(defaultValue)
            });
        }

        let macro = function(): DoDisplayHandler {
            let varArgs = [...arguments];
            let localContext: any = {};

            for (let macroArgument of macroArguments) {
                let macroArgumentName = macroArgument.name;

                localContext[macroArgumentName] = varArgs.shift();
            }

            localContext[VARARGS_NAME] = varArgs;

            localContext = environment.mergeGlobals(localContext);

            return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
                let output = bodyHandler(template, localContext, blocks);

                return output === '' ? '' : new TwingMarkup(output, charset);
            }
        };

        compiler.setMacro(macroName, {
            handler: macro,
            arguments: macroArguments
        });

        return () => {

        }
    }
}

export default TwingNodeMacro;