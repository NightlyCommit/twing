import {TwingNodeExpression} from "../expression";

import {TwingTemplate} from "../../template";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node";

export class TwingNodeExpressionGetAttr extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, attribute: TwingNodeExpression, methodArguments: TwingNodeExpression, type: string, lineno: number, columnno: number) {
        let nodes = new Map();

        nodes.set('node', node);
        nodes.set('attribute', attribute);

        if (methodArguments) {
            nodes.set('arguments', methodArguments);
        }

        let nodeAttributes = new Map();

        nodeAttributes.set('type', type);
        nodeAttributes.set('is_defined_test', false);
        nodeAttributes.set('ignore_strict_check', false);
        nodeAttributes.set('optimizable', true);

        super(nodes, nodeAttributes, lineno, columnno);

        this.type = TwingNodeType.EXPRESSION_GET_ATTR;
    }

    compile(compiler: TwingCompiler) {
        let env = compiler.getEnvironment();

        // optimize array, hash and Map calls
        if (this.getAttribute('optimizable')
            && (!env.isStrictVariables() || this.getAttribute('ignore_strict_check'))
            && !this.getAttribute('is_defined_test')
            && TwingTemplate.ARRAY_CALL === this.getAttribute('type')) {
            let var_ = compiler.getVarName();

            compiler
                .raw('(() => {let ' + var_ + ' = ')
                .subcompile(this.getNode('node'))
                .raw('; return this.isMap(')
                .raw(var_)
                .raw(') ? (')
                .raw(var_)
                .raw('.has(')
                .subcompile(this.getNode('attribute'))
                .raw(') ? ')
                .raw(var_)
                .raw('.get(')
                .subcompile(this.getNode('attribute'))
                .raw(') : null) : (Array.isArray(')
                .raw(var_)
                .raw(') || this.isPlainObject(')
                .raw(var_)
                .raw(') ? ')
                .raw(var_)
                .raw('[')
                .subcompile(this.getNode('attribute'))
                .raw('] : null);})()')
            ;

            return;
        }

        compiler.raw(`this.traceableMethod(this.getAttribute, ${this.getTemplateLine()}, this.getSourceContext())(`);

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        compiler.subcompile(this.getNode('node'));

        compiler.raw(', ').subcompile(this.getNode('attribute'));

        if (this.hasNode('arguments')) {
            compiler.raw(', ').subcompile(this.getNode('arguments'));
        } else {
            compiler.raw(', []');
        }

        compiler
            .raw(', ').repr(this.getAttribute('type'))
            .raw(', ').repr(this.getAttribute('is_defined_test'))
            .raw(', ').repr(this.getAttribute('ignore_strict_check'))
            .raw(', ').repr(env.isSandboxed())
            .raw(')');
    };
}
