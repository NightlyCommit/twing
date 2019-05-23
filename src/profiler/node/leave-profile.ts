import {TwingNode, TwingNodeType} from "../../node";
import {TwingCompiler} from "../../compiler";

export class TwingProfilerNodeLeaveProfile extends TwingNode {
    constructor(varName: string) {
        super(new Map(), new Map([['var_name', varName]]));

        this.type = TwingNodeType.PROFILER_LEAVE_PROFILE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("\n")
            .write(`${this.getAttribute('var_name')}.leave(${this.getAttribute('var_name') + 'Prof'});\n\n`)
        ;
    }
}
