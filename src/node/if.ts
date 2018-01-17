import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeIf extends TwingNode {
    constructor(tests: TwingNode, elseNode: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('tests', tests);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let tests: Array<any> = [];

        let i = 0;

        while (i < this.getNode('tests').getNodes().size) {
            tests.push({
                conditionHandler: compiler.subcompile(this.getNode('tests').getNode(i)),
                valueHandler: compiler.subcompile(this.getNode('tests').getNode(i + 1))
            });

            i += 2;
        }

        let elseHandler: DoDisplayHandler;

        if (this.hasNode('else')) {
            elseHandler = compiler.subcompile(this.getNode('else'));
        }
        else {
            elseHandler = () => {
            }
        }

        return (template: TwingTemplate, context: any, blocks: any) => {
            for (let test of tests) {
                if (test.conditionHandler(template, context, blocks)) {
                    return test.valueHandler(template, context, blocks);
                }
            }

            return compiler.repr(elseHandler(template, context, blocks));
        }
    }
}

export default TwingNodeIf;