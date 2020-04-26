import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionConstant, type as constantType} from "./constant";
import {TwingCompiler} from "../../compiler";
import {push} from "../../helpers/push";
import {ctypeDigit} from "../../helpers/ctype-digit";
import {TwingNodeType} from "../../node-type";

let array_chunk = require('locutus/php/array/array_chunk');

export const type = new TwingNodeType('expression_array');

export class TwingNodeExpressionArray extends TwingNodeExpression {
    private index: number;

    constructor(elements: Map<string | number, TwingNodeExpression>, lineno: number, columno: number) {
        super(elements, new Map(), lineno, columno);

        this.index = -1;

        for (let pair of this.getKeyValuePairs()) {
            let expression = pair.key;

            if ((expression.is(constantType)) && (ctypeDigit('' + expression.getAttribute('value'))) && (expression.getAttribute('value') > this.index)) {
                this.index = expression.getAttribute('value');
            }
        }
    }

    get type() {
        return type;
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
        compiler.raw('new Map([');

        let first = true;

        for (let pair of this.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(', ');
            }

            first = false;

            compiler
                .raw('[')
                .subcompile(pair.key)
                .raw(', ')
                .subcompile(pair.value)
                .raw(']')
        }

        compiler.raw('])');
    }
}
