import {TwingCompiler} from "../../compiler";
import {TwingNodePrint} from "../../node/print";

export class TwingSourceMapNodePrint extends TwingNodePrint {
    compile(compiler: TwingCompiler) {
        compiler
            .write('this.extensions.get(\'TwingExtensionSourceMap\').log(1,2,3,4);\n')
        ;

        super.compile(compiler);
    }
}
