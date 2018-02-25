import {TwingNodeExpression} from "../expression";
import {TwingMap} from "../../map";
import {TwingNode} from "../../node";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export class TwingNodeExpressionConstant extends TwingNodeExpression {
    constructor(value: TwingNode | string | number | boolean, lineno: number) {
        super(new TwingMap(), new TwingMap([['value', value]]), lineno);

        this.type = TwingNodeType.EXPRESSION_CONSTANT;
    }

    compile(compiler: TwingCompiler) {
        compiler.repr(this.getAttribute('value'));
    }
}
