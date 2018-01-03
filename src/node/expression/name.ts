import TwingNodeExpression from "../expression";
import TwingNodeExpressionType from "../expression-type";
import TwingMap from "../../map";
import TwingTemplate = require("../../template");
import TwingErrorRuntime from "../../error/runtime";

class TwingNodeExpressionName extends TwingNodeExpression {
    private specialVars: TwingMap<string, string>;

    public expressionType: TwingNodeExpressionType;

    constructor(name: string, lineno: number) {
        let attributes = new TwingMap();

        attributes.set('name', name);
        attributes.set('is_defined_test', false);
        attributes.set('ignore_strict_check', false);
        attributes.set('always_defined', false);

        super(new TwingMap(), attributes, lineno);

        this.expressionType = TwingNodeExpressionType.NAME;
    }

    clone() {
        return new TwingNodeExpressionName(this.getAttribute('name'), this.lineno);
    }

    compile(context: any, template: TwingTemplate): any {
        this.specialVars = new TwingMap([
            ['_self', template.getTemplateName()],
            ['_context', context],
            ['_charset', template.getEnvironment().getCharset()]
        ]);

        let name = this.getAttribute('name');

        if (this.getAttribute('is_defined_test')) {
            if (this.isSpecial()) {
                return true;
            }
            else {
                return context.hasOwnProperty(name);
            }
        }
        else if (this.isSpecial()) {
            return this.specialVars.get(name);
        }

        if (this.getAttribute('ignore_strict_check') || !template.getEnvironment().isStrictVariables()) {
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

    isSpecial() {
        return this.specialVars.has(this.getAttribute('name'));
    }

    isSimple() {
        return !this.isSpecial() && !this.getAttribute('is_defined_test');
    }
}

export default TwingNodeExpressionName;