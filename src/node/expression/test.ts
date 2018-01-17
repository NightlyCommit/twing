import TwingNodeExpressionCall from "./call";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionTest extends TwingNodeExpressionCall {
    constructor(node: TwingNode, name: string|TwingNode, nodeArguments: TwingNode = null, lineno: number)  {
        let nodes = new TwingMap();

        nodes.set('node', node);

        if (nodeArguments !== null) {
            nodes.set('arguments', nodeArguments);
        }

        super(nodes, new TwingMap([['name', name]]), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
            let name = this.getAttribute('name');
            let test = compiler.getEnvironment().getTest(name);

            this.setAttribute('name', name);
            this.setAttribute('type', 'test');
            this.setAttribute('callable', test.getCallable());
            this.setAttribute('is_variadic', test.isVariadic());

            return super.compileCallable(compiler);
    }
}

export default TwingNodeExpressionTest;
