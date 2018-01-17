import TwingNodeExpressionTest from "../test";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";

class TwingNodeExpressionTestSameAs extends TwingNodeExpressionTest {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let leftHandler = compiler.subcompile(this.getNode('node'));
        let rightHandler = compiler.subcompile(this.getNode('arguments').getNode(0));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return leftHandler(template, context, blocks) === rightHandler(template, context, blocks);
        }
    }
}

export default TwingNodeExpressionTestSameAs;