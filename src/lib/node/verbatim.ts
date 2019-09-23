import {TwingNodeType} from "../node";
import {TwingNodeText} from "./text";

/**
 * Represents a verbatim node.
 *
 * @author Eric Morand <eric.morand@gmail.com>
 */
export class TwingNodeVerbatim extends TwingNodeText {
    constructor(data: string, lineno: number, columnno: number, tag: string) {
        super(data, lineno, columnno, tag);

        this.type = TwingNodeType.VERBATIM;
    }
}
