import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingNodeExpressionType from "../expression-type";
import TwingAttributeGetter = require("../../attribute-getter");
import TwingTemplate = require("../../template");

class TwingNodeExpressionGetAttr extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, attribute: TwingNodeExpression, methodArguments: TwingNodeExpression, type: string, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('attribute', attribute);

        if (methodArguments) {
            nodes.set('arguments', methodArguments);
        }

        let nodeAttributes = new TwingMap();

        nodeAttributes.set('type', type);
        nodeAttributes.set('is_defined_test', false);
        nodeAttributes.set('ignore_strict_check', false);

        super(nodes, nodeAttributes, lineno);

        this.expressionType = TwingNodeExpressionType.GET_ATTR;
    }

    compile(context: any, template: TwingTemplate) {
        let attributes = [];

        let attributeGetter = new TwingAttributeGetter();

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        let object: any = this.getNode('node').compile(context, template);
        let attribute: string = this.getNode('attribute').compile(context, template);

        let result = attributeGetter.getAttribute(
            template.getEnvironment(),
            template.getSourceContext(),
            object,
            attribute,
            [],
            this.getAttribute('type'),
            this.getAttribute('is_defined_test') ? true : false,
            this.getAttribute('ignore_strict_check') ? true : false
        );

        return result;
    }
}

export default TwingNodeExpressionGetAttr;