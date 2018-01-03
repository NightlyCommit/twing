import TwingNodeExpression from "../expression";
import TwingNodeExpressionType from "../expression-type";
import TwingNodeExpressionConstant from "./constant";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");

let array_chunk = require('locutus/php/array/array_chunk');
let ctype_digit = require('locutus/php/ctype/ctype_digit');

class TwingNodeExpressionArray extends TwingNodeExpression {
    private index: number;

    constructor(elements: TwingMap<string, TwingNodeExpression>, lineno: number) {
        super(elements, new TwingMap(), lineno);

        this.index = -1;

        this.getKeyValuePairs().forEach(function (pair) {
            let expression = pair.key;

            if ((expression.getExpressionType() === TwingNodeExpressionType.CONSTANT) && (ctype_digit('' + expression.getAttribute('value'))) && (expression.getAttribute('value') > this.index)) {
                this.index = expression.getAttribute('value');
            }
        });

        this.expressionType = TwingNodeExpressionType.ARRAY;
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

    compile(context: any, template: TwingTemplate): any {
        let results: Array<any> = [];

        this.getKeyValuePairs().forEach(function (pair) {
            results.push(pair.value.compile(context, template));
        });

        return results;
    }
}

export default TwingNodeExpressionArray;