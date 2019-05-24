import {TwingNodeExpression} from "../expression";
import {TwingNodeExpressionArray} from "./array";

import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionMethodCall extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number, columnno: number) {
        let nodes = new Map();

        nodes.set('node', node);
        nodes.set('arguments', methodArguments);

        let attributes = new Map();

        attributes.set('method', method);
        attributes.set('safe', false);

        super(nodes, attributes, lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_METHOD_CALL;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .raw('context.get(')
            .subcompile(this.getNode('node'), true)
            .raw(').')
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
