import TwingTemplate from "../../template";
import TwingNodeExpressionArray from "./array";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";
import TwingNodeBlock from "../block";

class TwingNodeExpressionHash extends TwingNodeExpressionArray {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let handlers: any = [];

        for (let pair of this.getKeyValuePairs()) {
            handlers.push({
                key: compiler.subcompile(pair.key),
                value: compiler.subcompile(pair.value)
            });
        }

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, TwingNodeBlock>) => {
            let result: any = {};

            for (let handler of handlers) {
                result[handler.key(template, context, blocks)] = handler.value(template, context, blocks);
            }

            return result;
        };
    }
}

export default TwingNodeExpressionHash;