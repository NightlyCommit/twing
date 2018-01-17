import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingErrorRuntime from "../error/runtime";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

/**
 * Represents a block call node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingNodeBlockReference extends TwingNode {
    constructor(name: string, lineno: number, tag: string = null) {
        super(new TwingMap(), new TwingMap([['name', name]]), lineno, tag);

        this.type = TwingNodeType.OUTPUT;
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            try {
                return template.renderBlock(this.getAttribute('name'), context, blocks);
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
    }
}

export default TwingNodeBlockReference;