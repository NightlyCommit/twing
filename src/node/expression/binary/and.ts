import TwingNodeExpressionBinary from "../binary";
import TwingTemplate from "../../../template";
import TwingMap from "../../../map";
import TwingCompiler from "../../../compiler";
import DoDisplayHandler from "../../../do-display-handler";

class TwingNodeExpressionBinaryAnd extends TwingNodeExpressionBinary {
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let leftHandler = compiler.subcompile(this.getNode('left'));
        let rightHandler = compiler.subcompile(this.getNode('right'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            // there is no need to evaluate right expression if left is falsy
            let left = leftHandler(template, context, blocks);
            let right = true;

            if (left) {
                right = rightHandler(template, context, blocks)
            }

            return this.execute(left, right);
        }
    }

    execute(left: any, right: any): any {
        return left && right ? true : false;
    }
}

export default TwingNodeExpressionBinaryAnd;