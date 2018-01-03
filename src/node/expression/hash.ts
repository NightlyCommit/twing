import TwingTemplate = require("../../template");
import TwingNodeExpressionArray from "./array";

class TwingNodeExpressionHash extends TwingNodeExpressionArray {
    compile(context: any, template: TwingTemplate): any {
        let result: any = {};

        this.getKeyValuePairs().forEach(function (pair) {
            result[pair.key.compile(context, template)] = pair.value.compile(context, template);
        });

        return result;
    }
}

export = TwingNodeExpressionHash;