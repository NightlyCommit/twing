import {TwingNode, TwingNodeType} from "../../node";
import {TwingCompiler} from "../../compiler";

/**
 * Represents a profile enter node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingProfilerNodeEnterProfile extends TwingNode {
    constructor(extensionName: string, type: string, name: string, varName: string) {
        super(new Map(), new Map([['extension_name', extensionName], ['name', name], ['type', type], ['var_name', varName]]));

        this.type = TwingNodeType.PROFILER_ENTER_PROFILE;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write(`let ${this.getAttribute('var_name')} = this.extensions.get(`,)
            .repr(this.getAttribute('extension_name'))
            .raw(");\n")
            .write(`let ${this.getAttribute('var_name') + 'Prof'} = new Runtime.TwingProfilerProfile(this.getTemplateName(), `)
            .repr(this.getAttribute('type'))
            .raw(', ')
            .repr(this.getAttribute('name'))
            .raw(');\n')
            .write(`${this.getAttribute('var_name')}.enter(${this.getAttribute('var_name') + 'Prof'});\n\n`)
        ;
    }
}
