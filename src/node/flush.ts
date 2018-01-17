import TwingNode from "../node";
import TwingMap from "../map";
import TwingTemplate from "../template";

class TwingNodeFlush extends TwingNode {
    constructor(lineno: number, tag = 'spaceless') {
        super(new TwingMap(), new TwingMap(), lineno, tag);
    }

    render(context: any, template: TwingTemplate, blocks: TwingMap<string, Array<any>> = new TwingMap): any {
        return '';
    }
}

export default TwingNodeFlush;