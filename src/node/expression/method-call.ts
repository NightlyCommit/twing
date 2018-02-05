import TwingNodeExpression from "../expression";
import TwingNodeExpressionArray from "./array";
import TwingMap from "../../map";
import TwingNodeExpressionName from "./name";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionMethodCall extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('arguments', methodArguments);

        let attributes = new TwingMap();

        attributes.set('method', method);
        attributes.set('safe', false);

        super(nodes, attributes, lineno);

        if (node instanceof TwingNodeExpressionName) {
            node.setAttribute('always_defined', true);
        }
    }

    compile(compiler: TwingCompiler) {
        compiler
            .subcompile(this.getNode('node'))
            .raw('.')
            .raw(this.getAttribute('method'))
            .raw('(')
        ;
        let first = true;

        let argumentsNode = this.getNode('arguments') as TwingNodeExpressionArray;

        for (let pair of argumentsNode.getKeyValuePairs()) {
            if (!first) {
                compiler.raw(', ');
            }
            first = false;

            compiler.subcompile(pair['value']);
        }

        compiler.raw(')');
    }
}

export default TwingNodeExpressionMethodCall;