import {TwingNode} from "../../node";

import {TwingCompiler} from "../../compiler";

export class TwingProfilerNodeLeaveProfile extends TwingNode {
    constructor(varName: string) {
        super(new Map(), new Map([['var_name', varName]]));
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("\n")
            .write(`${this.getAttribute('var_name')}.leave(${this.getAttribute('var_name')});\n\n` + '_prof')
        ;
    }
}
