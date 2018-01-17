import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingErrorRuntime from "../error/runtime";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

const merge = require('merge');

class TwingNodeWith extends TwingNode {
    constructor(body: TwingNode, variables: TwingNode = null, only: boolean = false, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('body', body);

        if (variables) {
            nodes.set('variables', variables);
        }

        super(nodes, new TwingMap([['only', only]]), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let variablesHandler: DoDisplayHandler;
        let bodyHandler: DoDisplayHandler = compiler.subcompile(this.getNode('body'));

        if (this.hasNode('variables')) {
            variablesHandler = compiler.subcompile(this.getNode('variables'));
        }

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) => {
            if (variablesHandler) {
                let variables = variablesHandler(template, context, blocks);

                if (typeof variables !== 'object') {
                    throw new TwingErrorRuntime('Variables passed to the "with" tag must be a hash.', this.getTemplateLine(), this.getTemplateName())
                }

                if (this.getAttribute('only')) {
                    context = {
                        _parent: context
                    };
                }
                else {
                    context['_parent'] = Object.assign({}, context);
                }

                merge(context, variables);
            }
            else {
                context['_parent'] = Object.assign({}, context);
            }

            let output = bodyHandler(template, context, blocks);

            // restore the context
            merge(context, context['_parent']);

            if (!context['_parent']) {
                delete context['_parent'];
            }

            return output;
        }
    }
}

export default TwingNodeWith;