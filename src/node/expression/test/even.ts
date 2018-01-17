import TwingNodeExpressionTest from "../test";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";

class TwingNodeExpressionTestEven extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let nodeHandler = compiler.subcompile(this.getNode('node'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return nodeHandler(template, context, blocks) % 2 === 0;
        }
    }
}

export default TwingNodeExpressionTestEven;