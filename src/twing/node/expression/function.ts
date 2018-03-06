import {TwingNode, TwingNodeType} from "../../node";
import {TwingMap} from "../../map";
import {TwingNodeExpressionCall} from "./call";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionFunction extends TwingNodeExpressionCall {
    constructor(name: string, functionArguments: TwingNode, lineno: number) {
        let nodes = new TwingMap([
            ['arguments', functionArguments]
        ]);

        let attributes = new TwingMap([
            ['name', name],
            ['is_defined_test', false]
        ]);

        super(nodes, attributes, lineno);

        this.type = TwingNodeType.EXPRESSION_FUNCTION;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');
        let function_ = compiler.getEnvironment().getFunction(name);

        this.setAttribute('name', name);
        this.setAttribute('type', 'function');
        this.setAttribute('needs_environment', function_.needsEnvironment());
        this.setAttribute('needs_context', function_.needsContext());
        this.setAttribute('arguments', function_.getArguments());

        let callable = function_.getCallable();

        if (name === 'constant' && this.getAttribute('is_defined_test')) {
            //callable = 'twig_constant_is_defined';
        }

        this.setAttribute('callable', callable);
        this.setAttribute('is_variadic', function_.isVariadic());

        this.compileCallable(compiler);
    }
}
