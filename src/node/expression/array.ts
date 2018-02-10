import TwingNodeExpression from "../expression";
import TwingNodeExpressionConstant from "./constant";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import TwingNodeType from "../../node-type";

let array_chunk = require('locutus/php/array/array_chunk');
let ctype_digit = require('locutus/php/ctype/ctype_digit');

class TwingNodeExpressionArray extends TwingNodeExpression {
    private index: number;

    constructor(elements: TwingMap<string, TwingNodeExpression>, lineno: number) {
        super(elements, new TwingMap(), lineno);

        this.type = TwingNodeType.ARRAY;

        this.index = -1;

        for (let pair of this.getKeyValuePairs()) {
            let expression = pair.key;

            if ((expression instanceof TwingNodeExpressionConstant) && (ctype_digit('' + expression.getAttribute('value'))) && (expression.getAttribute('value') > this.index)) {
                this.index = expression.getAttribute('value');
            }
        }
    }

    getKeyValuePairs(): Array<{key: TwingNodeExpression, value: TwingNodeExpression}> {
        let pairs: Array<{key: TwingNodeExpression, value: TwingNodeExpression}> = [];

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

            key = new TwingNodeExpressionConstant(this.index, value.getTemplateLine());
        }

        this.nodes.push(key);
        this.nodes.push(value);
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

export default TwingNodeExpressionArray;