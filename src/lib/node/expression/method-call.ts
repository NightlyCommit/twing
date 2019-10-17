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
        attributes.set('is_defined_test', false);

        super(nodes, attributes, lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_METHOD_CALL;
    }

    compile(compiler: TwingCompiler) {
        if (this.getAttribute('is_defined_test')) {
            compiler
                .raw('(await aliases.proxy[')
                .repr(this.getNode('node').getAttribute('name'))
                .raw('].hasMacro(')
                .repr(this.getAttribute('method'))
                .raw('))')
            ;
        }
        else {
            compiler
                .raw('await this.callMacro(aliases.proxy[')
                .repr(this.getNode('node').getAttribute('name'))
                .raw('], ')
                .repr(this.getAttribute('method'))
                .raw(', [')
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

            compiler
                .raw('], ')
                .repr(this.getTemplateLine())
                .raw(', context, this.getSourceContext())');
        }
    }
}
