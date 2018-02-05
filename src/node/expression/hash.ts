import TwingNodeExpressionArray from "./array";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionHash extends TwingNodeExpressionArray {
    compile(compiler: TwingCompiler) {
        compiler
            .raw('new Map([')
        ;

        let first = true;

        for (let pair of this.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(', ');
            }

            first = false;

            compiler
                .raw('[')
                .subcompile(pair.key)
                .raw(', ')
                .subcompile(pair.value)
                .raw(']')
            ;
        }

        compiler.raw('])\n');
    }
}

export default TwingNodeExpressionHash;