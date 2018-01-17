import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingNode from "../../node";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionConstant extends TwingNodeExpression {
    constructor(value: TwingNode | string | number | boolean, lineno: number) {
        super(new TwingMap(), new TwingMap([['value', value]]), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let value = this.getAttribute('value');

        return () => {
            return value;
        };
    }
}

export default TwingNodeExpressionConstant;