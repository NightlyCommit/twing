import TwingNodeExpression from "../expression";
import TwingNodeExpressionArray from "./array";
import TwingNodeExpressionType from "../expression-type";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionMethodCall extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('arguments', methodArguments);

        let attributes = new TwingMap();

        attributes.set('method', method);
        attributes.set('safe', false);

        super(nodes, attributes, lineno);

        if (node.getExpressionType() === TwingNodeExpressionType.NAME) {
            node.setAttribute('always_defined', true);
        }
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let tplName = this.getNode('node').getAttribute('name');
        let macroName = this.getAttribute('method');
        let macroArguments: Array<any> = this.getNode('arguments').compile(context, template, blocks);
        let macroTemplate = context[tplName];
        let macroDefinition = macroTemplate.getMacro(macroName);

        if (macroDefinition) {
            let macro = macroDefinition.macro;
            let argumentDefinitions = macroDefinition.arguments;
            let localContext = Object.assign({}, context);
            let index: number = 0;

            macroArguments.forEach(function(macroArgument) {
                let argumentDefinition = argumentDefinitions[index];

                if (argumentDefinition) {
                    localContext[argumentDefinition.name] = macroArgument;
                }

                index++;
            });

            // consume remaining arguments
            if (argumentDefinitions.length > (index + 1)) {
                for (index; index < argumentDefinitions.length; index++) {
                    let argumentDefinition = argumentDefinitions[index];

                    localContext[argumentDefinition.name] = argumentDefinition.defaultValue.compile(context, template, blocks);

                    index++;
                }
            }

            return macro(localContext, blocks);
        }
    }
}

export default TwingNodeExpressionMethodCall;