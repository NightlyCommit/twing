import {TwingNode, TwingNodeType} from "../../node";

import {TwingNodeExpressionCall} from "./call";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionFunction extends TwingNodeExpressionCall {
    constructor(name: string, functionArguments: TwingNode, lineno: number, columnno: number) {
        let nodes = new Map([
            ['arguments', functionArguments]
        ]);

        let attributes = new Map();

        attributes.set('name', name);
        attributes.set('is_defined_test', false);

        super(nodes, attributes, lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_FUNCTION;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');
        let function_ = compiler.getEnvironment().getFunction(name);

        this.setAttribute('name', name);
        this.setAttribute('type', 'function');
        this.setAttribute('needs_environment', function_.needsEnvironment());
        this.setAttribute('needs_context', function_.needsContext());
        this.setAttribute('needs_source', function_.needsSource());
        this.setAttribute('arguments', function_.getArguments());

        let callable = function_.getCallable();

        this.setAttribute('callable', callable);
        this.setAttribute('is_variadic', function_.isVariadic());

        this.compileCallable(compiler);
    }
}
