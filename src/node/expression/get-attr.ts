import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingErrorRuntime from "../../error/runtime";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

import getAttribute from '../../util/get-attribute';

class TwingNodeExpressionGetAttr extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, attribute: TwingNodeExpression, methodArguments: TwingNodeExpression, type: string, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('attribute', attribute);

        if (methodArguments) {
            nodes.set('arguments', methodArguments);
        }

        let nodeAttributes = new TwingMap();

        nodeAttributes.set('type', type);
        nodeAttributes.set('is_defined_test', false);
        nodeAttributes.set('ignore_strict_check', false);

        super(nodes, nodeAttributes, lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let argumentsHandler = this.hasNode('arguments') ? compiler.subcompile(this.getNode('arguments')) : null;

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        let objectHandler = compiler.subcompile(this.getNode('node'));
        let attributeHandler = compiler.subcompile(this.getNode('attribute'));
        let type = this.getAttribute('type');
        let isDefinedTest = this.getAttribute('is_defined_test') ? true : false;
        let ignoreStrictCheck = this.getAttribute('ignore_strict_check') ? true : false;

        return (template: TwingTemplate, context: any, blocks: any) => {
            try {
                let result = getAttribute(
                    compiler.getEnvironment(),
                    template.getSourceContext(),
                    objectHandler(template, context, blocks),
                    attributeHandler(template, context, blocks),
                    argumentsHandler ? argumentsHandler(template, context, blocks) : [],
                    type,
                    isDefinedTest,
                    ignoreStrictCheck
                );

                return result;
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
    };

    // render(context: any, template: TwingTemplate, blocks: TwingMap<string, Array<any>> = new TwingMap): any {
    //     let arguments_ = this.hasNode('arguments') ? this.getNode('arguments').render(context, template, blocks) : [];
    //
    //     if (this.getAttribute('ignore_strict_check')) {
    //         this.getNode('node').setAttribute('ignore_strict_check', true);
    //     }
    //
    //     let object: any = this.getNode('node').render(context, template, blocks);
    //     let attribute: string = this.getNode('attribute').render(context, template, blocks);
    //
    //     try {
    //         let result = getAttribute(
    //             template.getEnvironment(),
    //             template.getSourceContext(),
    //             object,
    //             attribute,
    //             arguments_,
    //             this.getAttribute('type'),
    //             this.getAttribute('is_defined_test') ? true : false,
    //             this.getAttribute('ignore_strict_check') ? true : false
    //         );
    //
    //         return result;
    //     }
    //     catch (e) {
    //         if (e instanceof TwingErrorRuntime) {
    //             if (e.getTemplateLine() === -1) {
    //                 e.setTemplateLine(this.getTemplateLine());
    //             }
    //         }
    //
    //         throw e;
    //     }
    // }
}

export default TwingNodeExpressionGetAttr;