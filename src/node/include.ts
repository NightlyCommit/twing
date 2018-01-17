import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingErrorLoader from "../error/loader";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

const merge = require('merge');

class TwingNodeInclude extends TwingNode {
    constructor(expr: TwingNodeExpression, variables: TwingNodeExpression = null, only: boolean = false, ignoreMissing: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('expr', expr);

        if (variables !== null) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only], ['ignore_missing', ignoreMissing]]), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let ignoreMissing = this.getAttribute('ignore_missing');
        let includedTemplateHandler: DoDisplayHandler = this.addGetTemplate(compiler);
        let includedContextHandler: DoDisplayHandler = this.addTemplateArguments(compiler);

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            let includedTemplate: TwingTemplate;

            if (ignoreMissing) {
                try {
                    includedTemplate = includedTemplateHandler(template, context, blocks);
                }
                catch (e) {
                    if (e instanceof TwingErrorLoader) {
                        // ignore missing template
                        return '';
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                includedTemplate = includedTemplateHandler(template, context, blocks);
            }

            let includedContext = includedContextHandler(template, context, blocks);

            return includedTemplate.display(includedContext);
        }
    }

    addGetTemplate(compiler: TwingCompiler): DoDisplayHandler {
        let templateHandler = compiler.subcompile(this.getNode('expr'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return template.loadTemplate(
                templateHandler(template, context, blocks),
                this.getTemplateName(),
                this.getTemplateLine()
            );
        }
    }

    addTemplateArguments(compiler: TwingCompiler): DoDisplayHandler {
        let variablesHandler = this.hasNode('variables') ? compiler.subcompile(this.getNode('variables')) : null;

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            if (!variablesHandler) {
                return this.getAttribute('only') === false ? context : {};
            }
            else {
                let variables = variablesHandler(template, context, blocks);

                if (this.getAttribute('only') === false) {
                    return merge(context, variables);
                }
                else {
                    return variables;
                }
            }
        }
    }
}

export default TwingNodeInclude;