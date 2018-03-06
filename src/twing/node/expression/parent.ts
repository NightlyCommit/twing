import {TwingNodeExpression} from "../expression";
import {TwingMap} from "../../map";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionParent extends TwingNodeExpression {
    constructor(name: string, lineno: number) {
        super(new TwingMap(), new TwingMap([['output', false], ['name', name]]), lineno);

        this.type = TwingNodeType.EXPRESSION_PARENT;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');

        const varValidator = require('var-validator');

        if (!varValidator.isValid(name)) {
            name = Buffer.from(name).toString('hex');
        }

        if (this.getAttribute('output')) {
            compiler
                .addDebugInfo(this)
                .write('await this.displayParentBlock(')
                .string(name)
                .raw(", context, blocks);\n")
            ;
        }
        else {
            compiler
                .raw('await this.renderParentBlock(')
                .string(name)
                .raw(', context, blocks)')
            ;
        }
    }
}
