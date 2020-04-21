import {TwingNode} from "../node";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('body');

/**
 * Represents a body node.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingNodeBody extends TwingNode {
    constructor(nodes: Map<any, any> = new Map(), attributes: Map<string, any> = new Map(), lineno: number = 0, columnno: number = 0, tag: string = null) {
        super(nodes, attributes, lineno, columnno, tag);
    }

    get type() {
        return type as any;
    }
}
