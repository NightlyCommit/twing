import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeSpaceless extends TwingNode {
    constructor(body: TwingNode, lineno: number, tag = 'spaceless') {
        let nodes = new TwingMap();

        nodes.set('body', body);

        super(nodes, new TwingMap(), lineno, tag);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let bodyHandler = compiler.subcompile(this.getNode('body'));

        return (template: TwingTemplate, context: any, blocks: any) => {
            return bodyHandler(template, context, blocks).replace(/>\s+</g, '><').trim();
        }
    }
}

export default TwingNodeSpaceless;