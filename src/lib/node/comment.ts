import {TwingNode, TwingNodeType} from "../node";
import {TwingCompiler} from "../compiler";

export class TwingNodeComment extends TwingNode {
    constructor(data: string, lineno: number, columnno: number) {
        super(new Map(), new Map([['data', data]]), lineno, columnno);

        this.type = TwingNodeType.COMMENT;
    }

    compile(compiler: TwingCompiler) {
        // noop
    }
}
