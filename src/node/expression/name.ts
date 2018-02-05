import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionName extends TwingNodeExpression {
    private specialVars: TwingMap<string, string>;

    constructor(name: string, lineno: number) {
        let attributes = new TwingMap();

        attributes.set('name', name);
        attributes.set('is_defined_test', false);
        attributes.set('ignore_strict_check', false);
        attributes.set('always_defined', false);

        super(new TwingMap(), attributes, lineno);

        this.specialVars = new TwingMap([
            ['_self', 'this.getTemplateName()'],
            ['_context', 'context'],
            ['_charset', 'this.env.getCharset()']
        ]);
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
                    .raw(') : (() => { throw new Twing.TwingErrorRuntime(\'Variable ')
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

export default TwingNodeExpressionName;