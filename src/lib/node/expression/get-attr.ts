import {TwingNodeExpression} from "../expression";
import {TwingTemplate} from "../../template";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_get_attr');

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
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        let env = compiler.getEnvironment();

        // optimize array, hash and Map calls
        if (this.getAttribute('optimizable')
            && (!env.isStrictVariables() || this.getAttribute('ignore_strict_check'))
            && !this.getAttribute('is_defined_test')
            && this.getAttribute('type') === TwingTemplate.ARRAY_CALL) {
            let var_ = compiler.getVarName();

            compiler
                .raw('await (async () => {let ' + var_ + ' = ')
                .subcompile(this.getNode('node'))
                .raw('; return this.get(')
                .raw(var_)
                .raw(', ')
                .subcompile(this.getNode('attribute'))
                .raw(');})()')
            ;

            return;
        }

        compiler.raw(`await this.traceableMethod(this.getAttribute, ${this.getTemplateLine()}, this.getSourceContext())(this.env, `);

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        compiler.subcompile(this.getNode('node'));

        compiler.raw(', ').subcompile(this.getNode('attribute'));

        if (this.hasNode('arguments')) {
            compiler.raw(', ').subcompile(this.getNode('arguments'));
        } else {
            compiler.raw(', new Map()');
        }

        compiler
            .raw(', ').repr(this.getAttribute('type'))
            .raw(', ').repr(this.getAttribute('is_defined_test'))
            .raw(', ').repr(this.getAttribute('ignore_strict_check'))
            .raw(', ').repr(env.isSandboxed())
            .raw(')');
    }
}
