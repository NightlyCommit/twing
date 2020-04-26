import {TwingNodeText} from "./text";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('verbatim');

/**
 * Represents a verbatim node.
 *
 * @author Eric Morand <eric.morand@gmail.com>
 */
export class TwingNodeVerbatim extends TwingNodeText {
    get type() {
        return type;
    }
}
