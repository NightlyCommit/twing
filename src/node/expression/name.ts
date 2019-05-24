import {TwingNodeExpression} from "../expression";

import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionName extends TwingNodeExpression {
    private specialVars: Map<string, string>;

    constructor(name: string, lineno: number, columnno: number) {
        let attributes = new Map();

        attributes.set('name', name);
        attributes.set('is_defined_test', false);
        attributes.set('ignore_strict_check', false);
        attributes.set('always_defined', false);

        super(new Map(), attributes, lineno, columnno);

        this.specialVars = new Map([
            ['_self', 'this.getTemplateName()'],
            ['_context', 'context'],
            ['_charset', 'this.env.getCharset()']
        ]);

        this.type = TwingNodeType.EXPRESSION_NAME;
    }

    compile(compiler: TwingCompiler) {
        let name: string = this.getAttribute('name');

        compiler.addDebugInfo(this);

        if (this.getAttribute('is_defined_test')) {
            if (this.isSpecial()) {
                compiler.repr(true);
            }
            else {
                compiler.raw('(context.has(').repr(name).raw('))');
            }
        }
        else if (this.isSpecial()) {
            compiler.raw(this.specialVars.get(name));
        }
        else if (this.getAttribute('always_defined')) {
            compiler
                .raw('context.get(')
                .string(name)
                .raw(')')
            ;
        }
        else {
            if (this.getAttribute('ignore_strict_check') || !compiler.getEnvironment().isStrictVariables()) {
                compiler
                    .raw('(context.has(')
                    .string(name)
                    .raw(') ? context.get(')
                    .string(name)
                    .raw(') : null)')
                ;
            }
            else {
                compiler
                    .raw('(context.has(')
                    .string(name)
                    .raw(') ? context.get(')
                    .string(name)
                    .raw(') : (() => { this.throwRuntimeError(\'Variable ')
                    .string(name)
                    .raw(' does not exist.\', ')
                    .repr(this.lineno)
                    .raw(', this.getSourceContext()); })()')
                    .raw(')')
                ;
            }
        }
    }

    isSpecial() {
        return this.specialVars.has(this.getAttribute('name'));
    }

    isSimple() {
        return !this.isSpecial() && !this.getAttribute('is_defined_test');
    }
}
