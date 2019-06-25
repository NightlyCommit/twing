import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionConstant} from "./constant";

import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";
import {push} from "../../helpers/push";
import {ctypeDigit} from "../../helpers/ctype_digit";

let array_chunk = require('locutus/php/array/array_chunk');

export class TwingNodeExpressionArray extends TwingNodeExpression {
    private index: number;

    constructor(elements: Map<string, TwingNodeExpression>, lineno: number, columno: number) {
        super(elements, new Map(), lineno, columno);

        this.type = TwingNodeType.EXPRESSION_ARRAY;

        this.index = -1;

        for (let pair of this.getKeyValuePairs()) {
            let expression = pair.key;

            if ((expression.getType() === TwingNodeType.EXPRESSION_CONSTANT) && (ctypeDigit('' + expression.getAttribute('value'))) && (expression.getAttribute('value') > this.index)) {
                this.index = expression.getAttribute('value');
            }
        }
    }

    getKeyValuePairs(): Array<{ key: TwingNodeExpression, value: TwingNodeExpression }> {
        let pairs: Array<{ key: TwingNodeExpression, value: TwingNodeExpression }> = [];

        array_chunk(Array.from(this.nodes.values()), 2).forEach(function (pair: Array<TwingNodeExpression>) {
            pairs.push({
                key: pair[0],
                value: pair[1]
            });
        });

        return pairs;
    }

    addElement(value: TwingNodeExpression, key: TwingNodeExpression = null) {
        if (key === null) {
            this.index++;

            key = new TwingNodeExpressionConstant(this.index, value.getTemplateLine(), value.getTemplateColumn());
        }

        push(this.nodes, key);
        push(this.nodes, value);
    }

    compile(compiler: TwingCompiler) {
        compiler.raw('[');

        let first = true;

        for (let pair of this.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(', ');
            }

            first = false;

            compiler.subcompile(pair.value);
        }

        compiler.raw(']');
    }
}
