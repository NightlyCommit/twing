import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionArray} from "./array";
import {TwingMap} from "../../map";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionMethodCall extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('arguments', methodArguments);

        let attributes = new TwingMap();

        attributes.set('method', method);
        attributes.set('safe', false);

        super(nodes, attributes, lineno);

        this.type = TwingNodeType.EXPRESSION_METHOD_CALL;

        if (node.getType() == TwingNodeType.EXPRESSION_NAME) {
            node.setAttribute('always_defined', true);
        }
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('await ')
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
