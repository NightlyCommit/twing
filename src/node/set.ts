import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeExpressionConstant} from "./expression/constant";
import {TwingNodeCaptureInterface} from "../node-capture-interface";

export class TwingNodeSet extends TwingNode implements TwingNodeCaptureInterface {
    TwingNodeCaptureInterfaceImpl: TwingNodeCaptureInterface;

    constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('names', names);
        nodes.set('values', values);

        let attributes = new Map();

        attributes.set('capture', capture);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, columnno, tag);

        this.type = TwingNodeType.SET;

        this.TwingNodeCaptureInterfaceImpl = this;

        /*
         * Optimizes the node when capture is used for a large block of text.
         *
         * {% set foo %}foo{% endset %} is compiled to $context['foo'] = new Twig_Markup("foo");
         */
        if (this.getAttribute('capture')) {
            this.setAttribute('safe', true);

            let values = this.getNode('values');

            if (values.getType() === TwingNodeType.TEXT) {
                this.setNode('values', new TwingNodeExpressionConstant(values.getAttribute('data'), values.getTemplateLine(), values.getTemplateColumn()));
                this.setAttribute('capture', false);
            }
        }
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);

        if (this.getNode('names').getNodes().size > 1) {
            let values = this.getNode('values');

            for (let [idx, node] of this.getNode('names').getNodes()) {
                if (idx) {
                    compiler.raw(' ');
                }

                compiler
                    .write('context.set(')
                    .subcompile(node)
                    .raw(', ')
                ;

                let value = values.getNode(idx);

                compiler
                    .subcompile(value)
                    .raw(');')
                ;
            }
        }
        else {
            if (this.getAttribute('capture')) {
                compiler
                    .write('(() => {\n')
                    .indent()
                    .write('let tmp;\n')
                    .write("Runtime.obStart();\n")
                    .subcompile(this.getNode('values'))
                ;
            }
            else {
                if (this.getAttribute('safe')) {
                    compiler
                        .write('(() => {\n')
                        .indent()
                        .write('let tmp;\n')
                    ;
                }
            }

            compiler
                .write('context.set(')
                .subcompile(this.getNode('names'), true)
                .raw(', ')
            ;

            if (this.getAttribute('capture')) {
                compiler
                    .raw("((tmp = Runtime.obGetClean()) === '') ? '' : new Runtime.TwingMarkup(tmp, this.env.getCharset()));\n")
                    .outdent()
                    .write('})();')
                ;
            }
        }

        if (!this.getAttribute('capture')) {
            if (this.getAttribute('safe')) {
                compiler
                    .raw("((tmp = ")
                    .subcompile(this.getNode('values'))
                    .raw(") === '') ? '' : new Runtime.TwingMarkup(tmp, this.env.getCharset()));\n")
                    .outdent()
                    .write('})();')
                ;
            }
            else if (this.getNode('names').getNodes().size === 1) {
                compiler
                    .subcompile(this.getNode('values'))
                    .raw(');')
                ;
            }
        }

        compiler.raw("\n");
    }
}
