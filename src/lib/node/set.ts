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
            compiler.write('[');

            for (let [idx, node] of this.getNode('names').getNodes()) {
                if (idx > 0) {
                    compiler.raw(', ');
                }

                compiler
                    .subcompile(node)
                ;
            }

            compiler.raw(']');
        } else {
            if (this.getAttribute('capture')) {
                compiler
                    .write("Runtime.obStart();\n")
                    .subcompile(this.getNode('values'))
                ;
            }

            compiler.subcompile(this.getNode('names'), false);

            if (this.getAttribute('capture')) {
                compiler
                    .raw(" = (() => {let tmp = Runtime.obGetClean(); return tmp === '' ? '' : new Runtime.TwingMarkup(tmp, this.env.getCharset());})()")
                ;
            }
        }

        if (!this.getAttribute('capture')) {
            compiler.raw(' = ');

            if (this.getNode('names').getNodes().size > 1) {
                compiler.raw('[');

                for (let [idx, value] of this.getNode('values').getNodes()) {
                    if (idx > 0) {
                        compiler.raw(', ');
                    }

                    compiler
                        .subcompile(value)
                    ;
                }

                compiler.raw(']');
            } else {
                if (this.getAttribute('safe')) {
                    compiler
                        .raw("(() => {let tmp = ")
                        .subcompile(this.getNode('values'))
                        .raw("; return tmp === '' ? '' : new Runtime.TwingMarkup(tmp, this.env.getCharset());})()")
                    ;
                } else {
                    compiler.subcompile(this.getNode('values'));
                }
            }
        }

        compiler.raw(';\n');
    }
}
