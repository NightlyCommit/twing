import {TwingNode, TwingNodeOutputType, TwingNodeType} from "../node";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeExpressionConstant} from "./expression/constant";

export class TwingNodeSet extends TwingNode {
    constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('names', names);
        nodes.set('values', values);

        let attributes = new TwingMap();

        attributes.set('capture', capture);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.SET;
        this.outputType = TwingNodeOutputType.CAPTURE;

        /*
         * Optimizes the node when capture is used for a large block of text.
         *
         * {% set foo %}foo{% endset %} is compiled to $context['foo'] = new Twig_Markup("foo");
         */
        if (this.getAttribute('capture')) {
            this.setAttribute('safe', true);

            let values = this.getNode('values');

            if (values.getType() === TwingNodeType.TEXT) {
                this.setNode('values', new TwingNodeExpressionConstant(values.getAttribute('data'), values.getTemplateLine()));
                this.setAttribute('capture', false);
            }
        }
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);

        if (this.getNode('names').getNodes().size > 1) {
            compiler.write('[');

            for (let [idx, node] of this.getNode('names').getNodes()) {
                if (idx) {
                    compiler.raw(', ');
                }

                compiler.subcompile(node);
            }

            compiler.raw(']');
        }
        else {
            if (this.getAttribute('capture')) {
                compiler
                    .write('let tmp;\n')
                    .write("Twing.obStart();\n")
                    .subcompile(this.getNode('values'))
                ;
            }
            else {
                if (this.getAttribute('safe')) {
                    compiler.write('let tmp;\n');
                }
            }

            compiler.subcompile(this.getNode('names'), false);

            if (this.getAttribute('capture')) {
                compiler.raw(" = ((tmp = Twing.obGetClean()) === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset())");
            }
        }

        if (!this.getAttribute('capture')) {
            compiler.raw(' = ');

            if (this.getNode('names').getNodes().size > 1) {
                compiler.write('[');

                for (let [idx, $value] of this.getNode('values').getNodes()) {
                    if (idx) {
                        compiler.raw(', ');
                    }

                    compiler.subcompile($value);
                }

                compiler.raw(']');
            }
            else {
                if (this.getAttribute('safe')) {
                    compiler
                        .write("((tmp = ")
                        .subcompile(this.getNode('values'))
                        .raw(") === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset())")
                    ;
                }
                else {
                    compiler.subcompile(this.getNode('values'));
                }
            }
        }

        compiler.raw(";\n");
    }
}
