import {TwingNodeExpression} from "../expression";

import {TwingNode, TwingNodeType} from "../../node";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionConstant extends TwingNodeExpression {
    constructor(value: TwingNode | string | number | boolean, lineno: number, columnno: number) {
        super(new Map(), new Map([['value', value]]), lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_CONSTANT;
    }

    compile(compiler: TwingCompiler) {
        compiler.repr(this.getAttribute('value'));
    }
}
