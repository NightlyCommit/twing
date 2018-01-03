import TwingMap from "../../map";
import TwingTemplateBlock from "../../template-block";
import TwingTemplate = require("../../template");
import TwingNodeExpressionMethodCall from "./method-call";

class TwingNodeExpressionMacroCall extends TwingNodeExpressionMethodCall {
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

export = TwingNodeExpressionMacroCall;