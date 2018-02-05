import TwingNodeExpressionName from "./name";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('Twing.getContextProxy(context)[')
            .string(this.getAttribute('name'))
            .raw(']')
        ;
    }
}

export default TwingNodeExpressionAssignName;