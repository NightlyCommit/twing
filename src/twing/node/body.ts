import {TwingNode, TwingNodeType} from "../node";
import {TwingMap} from "../map";

/**
 * Represents a body node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeBody extends TwingNode {
    constructor(nodes: TwingMap<any, any> = new TwingMap(), attributes: TwingMap<string, any> = new TwingMap(), lineno: number = 0, tag: string = null) {
        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.BODY;
    }
}
