import TwingNodeExpressionCall from "./call";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import TwingNodeType from "../../node-type";

class TwingNodeExpressionTest extends TwingNodeExpressionCall {
    constructor(node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode = null, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);

        if (nodeArguments !== null) {
            nodes.set('arguments', nodeArguments);
        }

        super(nodes, new TwingMap([['name', name]]), lineno);

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

export default TwingNodeExpressionTest;
