import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('comment');

export class TwingNodeComment extends TwingNode {
    constructor(data: string, lineno: number, columnno: number) {
        super(new Map(), new Map([['data', data]]), lineno, columnno);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        // noop
    }
}
