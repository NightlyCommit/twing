import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionFunction extends TwingNodeExpression {
    constructor(name: string, functionArguments: TwingNode, lineno: number) {
        let nodes = new TwingMap([
            ['arguments', functionArguments]
        ]);

        let attributes = new TwingMap([
            ['name', name],
            ['is_defined_test', false]
        ]);

        super(nodes, attributes, lineno);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result = null;
        let name = this.getAttribute('name');
        let function_ = template.getEnvironment().getFunction(name);

        let callable = function_.getCallable();
        let callableArguments: Array<any> = [
            template.getEnvironment(),
            context
        ];

        this.getNode('arguments').getNodes().forEach(function(argumentNode) {
            callableArguments.push(argumentNode.compile(context, template, blocks));
        });

        if (name === 'constant' && this.getAttribute('is_defined_test')) {
            //callable = 'twig_constant_is_defined';
        }

        result = callable.apply(this, callableArguments);

        return result;
    }
}

export = TwingNodeExpressionFunction;