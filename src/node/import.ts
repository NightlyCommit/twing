/**
 * Represents an import node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingNodeExpressionName from "./expression/name";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";
import {type} from "os";

class TwingNodeImport extends TwingNode {
    constructor(expr: TwingNodeExpression, varName: TwingNodeExpression, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);
        nodes.set('var', varName);

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let exprHandler = compiler.subcompile(this.getNode('expr'));
        let varHandler = compiler.subcompile(this.getNode('var'));
        let importedTemplateHandler: DoDisplayHandler;

        if ((this.getNode('expr') instanceof TwingNodeExpressionName) && (this.getNode('expr').getAttribute('name') === '_self')) {
            importedTemplateHandler = (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
                return template;
            }
        }
        else {
            importedTemplateHandler = (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
                return template.loadTemplate(
                    exprHandler(template, context, blocks),
                    this.getTemplateName(),
                    this.getTemplateLine()
                );
            }
        }

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap) => {
            let var_ = varHandler(template, context, blocks);
            let importedTemplate = importedTemplateHandler(template, context, blocks);

            var_.value = importedTemplate;
        }
    }
}

export default TwingNodeImport;
