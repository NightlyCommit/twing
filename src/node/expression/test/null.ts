import TwingNodeExpressionTest from "../test";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";
import {isNullOrUndefined} from "util";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";

class TwingNodeExpressionTestNull extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let nodeHandler = compiler.subcompile(this.getNode('node'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            let value = nodeHandler(template, context, blocks);

            return isNullOrUndefined(value);
        }
    }
}

export default TwingNodeExpressionTestNull;