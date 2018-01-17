import TwingNode from "../node";
import TwingNodeType from "../node-type";
import TwingMap from "../map";
import TwingCompiler from "../compiler";

class TwingNodeText extends TwingNode {
    constructor(data: string, line: number) {
        super(new TwingMap(), new TwingMap([['data', data]]), line);

        this.type = TwingNodeType.OUTPUT;
    }

    compile(compiler: TwingCompiler) {
        return () => {
            return this.getAttribute('data');
        };
    }
}

export default TwingNodeText;