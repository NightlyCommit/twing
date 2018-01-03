import TwingNode from "../node";
import TwingMap from "../map";

class TwingNodeAutoEscape extends TwingNode {
    constructor(value: {}, body: TwingNode, lineno: number, tag = 'autoescape') {
        super(new TwingMap([['body', body]]), new TwingMap([['value', value]]), lineno, tag);
    }
}

export default TwingNodeAutoEscape;