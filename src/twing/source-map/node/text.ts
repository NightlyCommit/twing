import {TwingCompiler} from "../../compiler";
import {TwingNodePrint} from "../../node/print";
import {TwingNodeText} from "../../node/text";

export class TwingSourceMapNodeText extends TwingNodeText {
    compile(compiler: TwingCompiler) {
        compiler
            .write('this.extensions.get(\'TwingExtensionSourceMap\').log(1,2,3,4);\n')
        ;

        super.compile(compiler);
    }
}
