import {TwingNodeExpressionCall} from "./call";
import {TwingNode} from "../../node";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_test');

export class TwingNodeExpressionTest extends TwingNodeExpressionCall {
    constructor(node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode, lineno: number, columnno: number) {
        let nodes = new Map();

        nodes.set('node', node);

        if (nodeArguments !== null) {
            nodes.set('arguments', nodeArguments);
        }

        super(nodes, new Map([['name', name]]), lineno, columnno);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');
        let test = compiler.getEnvironment().getTest(name);

        this.setAttribute('name', name);
        this.setAttribute('type', 'test');
        this.setAttribute('needs_template', test.needsTemplate());
        this.setAttribute('arguments', test.getArguments());
        this.setAttribute('callable', test.getCallable());
        this.setAttribute('is_variadic', test.isVariadic());
        this.setAttribute('accepted_arguments', test.getAcceptedArgments());

        super.compileCallable(compiler);
    }
}
