import TwingNodeExpression from "../expression";
import TwingNodeExpressionType from "../expression-type";
import TwingMap from "../../map";
import TwingNode from "../../node";
import TwingTemplate = require("../../template");
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionConstant extends TwingNodeExpression {
    public expressionType = TwingNodeExpressionType.CONSTANT;

    constructor(value: TwingNode | string | number | boolean, lineno: number) {
        super(new TwingMap(), new TwingMap([['value', value]]), lineno);
    }

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        return this.getAttribute('value');
    }
}

export default TwingNodeExpressionConstant;