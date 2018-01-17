import TwingNodeExpression from "../expression";
import TwingNodeExpressionConstant from "./constant";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

let array_chunk = require('locutus/php/array/array_chunk');
let ctype_digit = require('locutus/php/ctype/ctype_digit');

class TwingNodeExpressionArray extends TwingNodeExpression {
    private index: number;

    constructor(elements: TwingMap<string, TwingNodeExpression>, lineno: number) {
        super(elements, new TwingMap(), lineno);

        this.index = -1;

        this.getKeyValuePairs().forEach(function (pair) {
            let expression = pair.key;

            if ((expression instanceof TwingNodeExpressionConstant) && (ctype_digit('' + expression.getAttribute('value'))) && (expression.getAttribute('value') > this.index)) {
                this.index = expression.getAttribute('value');
            }
        });
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

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let handlers: Array<DoDisplayHandler> = [];

        for (let pair of this.getKeyValuePairs()) {
            handlers.push(compiler.subcompile(pair.value));
        }

        return (context: any, template: TwingTemplate, blocks: TwingMap<string, Array<any>>) => {
            let result: Array<any> = [];

            for (let handler of handlers) {
                result.push(handler(context, template, blocks));
            }

            return result;
        };
    }
}

export default TwingNodeExpressionArray;