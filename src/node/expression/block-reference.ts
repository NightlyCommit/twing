import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingNode from "../../node";
import TwingTemplate from "../../template";
import TwingErrorRuntime from "../../error/runtime";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionBlockReference extends TwingNodeExpression {
    constructor(name: TwingNode, template: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('name', name);

        if (template) {
            nodes.set('template', template);
        }

        let attributes = new TwingMap([
            ['is_defined_test', false],
            ['output', false]
        ]);

        super(nodes, attributes, lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let templateHandler = this.compileTemplateCall(compiler);
        let argumentsHandler = this.compileBlockArguments(compiler);

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            let blockFunction: Function;
            let blockTemplate: TwingTemplate = templateHandler(template, context, blocks);
            let blockArguments: Array<any> = argumentsHandler(template, context, blocks);

            if (this.getAttribute('is_defined_test')) {
                blockFunction = blockTemplate.hasBlock;
            }
            else {
                blockFunction = blockTemplate.displayBlock;
            }

            try {
                return blockFunction.apply(blockTemplate, blockArguments);
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

    compileTemplateCall(compiler: TwingCompiler): DoDisplayHandler {
        let templateHandler: DoDisplayHandler;

        if (this.hasNode('template')) {
            templateHandler = compiler.subcompile(this.getNode('template'));
        }

        return (template, context, blocks) => {
            if (!templateHandler) {
                return template;
            }
            else {
                return template.loadTemplate(
                    templateHandler(template, context, blocks),
                    this.getTemplateName(),
                    this.getTemplateLine()
                ) as TwingTemplate;
            }
        }
    }

    compileBlockArguments(compiler: TwingCompiler): DoDisplayHandler {
        let handlers: Array<DoDisplayHandler> = [
            compiler.subcompile(this.getNode('name')),
            (template, context, blocks) => {
                return context;
            }
        ];

        if (!this.hasNode('template')) {
            handlers.push((template, context, blocks) => {
                return blocks;
            });
        }

        return (template, context, blocks) => {
            let results: Array<any> = [];

            for (let handler of handlers) {
                results.push(handler(template, context, blocks));
            }

            return results;
        }
    }

    /*render(context: any, template: TwingTemplate, blocks: TwingMap<string, Array<any>> = new TwingMap): any {
        let result;

        let compileTemplateCall = function(): TwingTemplate {
            let result: TwingTemplate;

            if (!this.hasNode('template')) {
                result = template;
            }
            else {
                result = template.loadTemplate(
                    this.getNode('template').render(context, template, blocks),
                    this.getTemplateName(),
                    this.getTemplateLine()
                ) as TwingTemplate;
            }

            return result;
        };

        let compileBlockArguments = function(): Array<any> {
            let results = [
                this.getNode('name').render(context, template, blocks),
                context
            ];

            if (!this.hasNode('template')) {
                results.push(blocks);
            }

            return results;
        };

        let blockTemplate = compileTemplateCall.apply(this);
        let blockArguments = compileBlockArguments.apply(this);
        let blockFunction: Function;

        if (this.getAttribute('is_defined_test')) {
            blockFunction = blockTemplate.hasBlock;
        }
        else {
            blockFunction = blockTemplate.renderBlock;
        }

        try {
            result = blockFunction.apply(blockTemplate, blockArguments);
        }
        catch (e) {
            if (e instanceof TwingErrorRuntime) {
                if (e.getTemplateLine() === -1) {
                    e.setTemplateLine(this.getTemplateLine());
                }
            }

            throw e;
        }

        return result;
    }*/
}

export default TwingNodeExpressionBlockReference;