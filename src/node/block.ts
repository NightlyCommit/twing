import TwingNode from "../node";
import TwingMap from "../map";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";
import TwingTemplate from "../template";

class TwingNodeBlock extends TwingNode {
    constructor(name: string, body: TwingNode, lineno: number, tag: string = null) {
        super(new TwingMap([['body', body]]), new TwingMap([['name', name]]), lineno, tag);
    }

    // in PHP a block add a function to the template named block_...
    compile(compiler: TwingCompiler): DoDisplayHandler {
        let handler = compiler.subcompile(this.getNode('body'));
        let name = this.getAttribute('name');

        compiler.setBlock(name, (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return handler(template, context, blocks);
        });

        return () => {
        }
    }
}

export default TwingNodeBlock;