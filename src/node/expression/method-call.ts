import TwingNodeExpression from "../expression";
import TwingNodeExpressionArray from "./array";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingNodeExpressionName from "./name";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";
import TwingMethodDefinition from "../../method-definition";

class TwingNodeExpressionMethodCall extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('arguments', methodArguments);

        let attributes = new TwingMap();

        attributes.set('method', method);
        attributes.set('safe', false);

        super(nodes, attributes, lineno);

        if (node instanceof TwingNodeExpressionName) {
            node.setAttribute('always_defined', true);
        }
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let nodeHandler = compiler.subcompile(this.getNode('node'));
        let macroArgumentsHandler = compiler.subcompile(this.getNode('arguments'));
        let macroName = this.getAttribute('method');

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
            let scope = nodeHandler(template, context, blocks) as any;
            let macroDefinition = scope[macroName] as TwingMethodDefinition;

            let macro = macroDefinition.handler;
            let macroArguments = macroArgumentsHandler(template, context, blocks);
            let macroArgumentDefinitions = macroDefinition.arguments.slice();

            let varArgs: Array<any> = [];

            for (let macroArgument of macroArguments) {
                macroArgumentDefinitions.shift();

                varArgs.push(macroArgument);
            }

            for (let macroArgumentDefinition of macroArgumentDefinitions) {
                varArgs.push(macroArgumentDefinition.defaultValue(template, context, blocks));
            }

            let macroHandler = macro(...varArgs);

            return macroHandler(template, context, blocks);
        }
    }
}

export default TwingNodeExpressionMethodCall;