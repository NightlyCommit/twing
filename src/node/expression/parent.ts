import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingErrorRuntime from "../../error/runtime";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionParent extends TwingNodeExpression {
    constructor(name: string, lineno: number) {
        super(new TwingMap(), new TwingMap([['output', false], ['name', name]]), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let name = this.getAttribute('name');

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
            try {
                return template.renderParentBlock(name, context, blocks);
            }
            catch (e) {
                if (e instanceof TwingErrorRuntime) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(this.getTemplateLine());
                    }
                }

                throw e;
            }
        }
    }
}

export default TwingNodeExpressionParent;