import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";

export class TwingNodeLine extends TwingNode {
    constructor(data: number, lineno: number, columnno: number, tag: string) {
        super(new Map(), new Map([['data', data]]), lineno, columnno, tag);

        this.type = TwingNodeType.LINE;
    }

    compile(compiler: TwingCompiler) {
        // noop
    }
}
