import {TwingNode} from "../../node";
import {TwingMap} from "../../map";
import {TwingCompiler} from "../../compiler";

export class TwingProfilerNodeLeaveProfile extends TwingNode {
    constructor(varName: string) {
        super(new TwingMap(), new TwingMap([['var_name', varName]]));
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write("\n")
            .write(`${this.getAttribute('var_name')}.leave(${this.getAttribute('var_name')});\n\n` + '_prof')
        ;
    }
}
