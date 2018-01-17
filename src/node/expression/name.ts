import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingErrorRuntime from "../../error/runtime";
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
    }

    compile(compiler: TwingCompiler) {
        return (template: TwingTemplate, context: any) => {
            this.specialVars = new TwingMap([
                ['_self', template.getTemplateName()],
                ['_context', context],
                ['_charset', compiler.getEnvironment().getCharset()]
            ]);

            let name = this.getAttribute('name');

            if (this.getAttribute('is_defined_test')) {
                if (this.isSpecial()) {
                    return true;
                }
                else {
                    return Reflect.has(context, name);
                }
            }
            else if (this.isSpecial()) {
                return this.specialVars.get(name);
            }
            else if (this.getAttribute('always_defined')) {
                return context[name];
            }
            else {
                if (this.getAttribute('ignore_strict_check') || !compiler.getEnvironment().isStrictVariables()) {
                    return context[name];
                }
                else {
                    if (Reflect.has(context, name)) {
                        return context[name];
                    }
                    else {
                        throw new TwingErrorRuntime(`Variable "${name}" does not exist.`, this.getTemplateLine(), template.getSourceContext());
                    }
                }
            }
        };
    }

    isSpecial() {
        return this.specialVars.has(this.getAttribute('name'));
    }

    isSimple() {
        return !this.isSpecial() && !this.getAttribute('is_defined_test');
    }
}

export default TwingNodeExpressionName;