import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingCompiler from "../compiler";

class TwingNodeSet extends TwingNode {
    constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('names', names);
        nodes.set('values', values);

        let attributes = new TwingMap();

        attributes.set('capture', capture);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.CAPTURE;

        if (this.getAttribute('capture')) {
            this.setAttribute('safe', true);
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
                        .raw("('' === tmp = ")
                        .subcompile(this.getNode('values'))
                        .raw(") ? '' : new TwingMarkup(tmp, this.env.getCharset())")
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

export default TwingNodeSet;