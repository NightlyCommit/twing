import {TwingNode} from "../../node";
import {TwingNodeExpressionCall} from "./call";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_function');

export class TwingNodeExpressionFunction extends TwingNodeExpressionCall {
    constructor(name: string, functionArguments: TwingNode, lineno: number, columnno: number) {
        let nodes = new Map([
            ['arguments', functionArguments]
        ]);

        let attributes = new Map();

        attributes.set('name', name);
        attributes.set('is_defined_test', false);

        super(nodes, attributes, lineno, columnno);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');
        let function_ = compiler.getEnvironment().getFunction(name);
        let callable = function_.getCallable();

        this.setAttribute('name', name);
        this.setAttribute('type', 'function');
        this.setAttribute('needs_template', function_.needsTemplate());
        this.setAttribute('needs_context', function_.needsContext());
        this.setAttribute('needs_output_buffer', function_.needsOutputBuffer());
        this.setAttribute('arguments', function_.getArguments());
        this.setAttribute('callable', callable);
        this.setAttribute('is_variadic', function_.isVariadic());
        this.setAttribute('accepted_arguments', function_.getAcceptedArgments());

        this.compileCallable(compiler);
    }
}
