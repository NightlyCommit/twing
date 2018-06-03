import {TwingNode, TwingNodeType} from "../node";


/**
 * Represents a body node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeBody extends TwingNode {
    constructor(nodes: Map<any, any> = new Map(), attributes: Map<string, any> = new Map(), lineno: number = 0, columnno: number = 0, tag: string = null) {
        super(nodes, attributes, lineno, columnno, tag);

        this.type = TwingNodeType.BODY;
    }
}
