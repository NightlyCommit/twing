import TwingNode from "../node";
import TwingMap from "../map";
import TwingCompiler from "../compiler";
import TwingNodeType from "../node-type";

class TwingNodeIf extends TwingNode {
    constructor(tests: TwingNode, elseNode: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('tests', tests);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        super(nodes, new TwingMap(), lineno, tag);

        this.type = TwingNodeType.IF;
    }

    compile(compiler: TwingCompiler) {
        compiler.addDebugInfo(this);
        let count = this.getNode('tests').getNodes().size;

        for (let i = 0; i < count; i += 2) {
            if (i > 0) {
                compiler
                    .outdent()
                    .write('}\n')
                    .write('else if (')
                ;
            } else {
                compiler
                    .write('if (')
                ;
            }

            compiler
                .subcompile(this.getNode('tests').getNode(i))
                .raw(") {\n")
                .indent()
                .subcompile(this.getNode('tests').getNode(i + 1))
            ;
        }

        if (this.hasNode('else')) {
            compiler
                .outdent()
                .write("}\n")
                .write("else {\n")
                .indent()
                .subcompile(this.getNode('else'))
            ;
        }

        compiler
            .outdent()
            .write("}\n");
    }
}

export default TwingNodeIf;