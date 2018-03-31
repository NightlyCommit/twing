import {TwingNodeExpressionCall} from "./call";
import {TwingNode, TwingNodeType} from "../../node";

import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionTest extends TwingNodeExpressionCall {
    constructor(node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode, lineno: number) {
        let nodes = new Map();

        nodes.set('node', node);

        if (nodeArguments !== null) {
            nodes.set('arguments', nodeArguments);
        }

        super(nodes, new Map([['name', name]]), lineno);

        this.type = TwingNodeType.EXPRESSION_TEST;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getAttribute('name');
        let test = compiler.getEnvironment().getTest(name);

        this.setAttribute('name', name);
        this.setAttribute('type', 'test');
        this.setAttribute('callable', test.getCallable());
        this.setAttribute('is_variadic', test.isVariadic());

        super.compileCallable(compiler);
    }
}
