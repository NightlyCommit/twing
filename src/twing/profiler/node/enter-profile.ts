import {TwingNode} from "../../node";

import {TwingCompiler} from "../../compiler";

/**
 * Represents a profile enter node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingProfilerNodeEnterProfile extends TwingNode {
    constructor(extensionName: string, type: string, name: string, varName: string) {
        super(new Map(), new Map([['extension_name', extensionName], ['name', name], ['type', type], ['var_name', varName]]));
    }

    compile(compiler: TwingCompiler) {
        compiler
            .write(`${this.getAttribute('var_name')}} = this.env.getExtension(`)
            .repr(this.getAttribute('extension_name'))
            .raw(");\n")
            .write(`${this.getAttribute('var_name')}.enter(${this.getAttribute('var_name')} = new Twing.TwingProfilerProfile(this.getTemplateName()` + '_prof')
            .repr(this.getAttribute('type'))
            .raw(', ')
            .repr(this.getAttribute('name'))
            .raw("));\n\n")
        ;
    }
}
