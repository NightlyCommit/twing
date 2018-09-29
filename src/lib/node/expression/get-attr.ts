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
                .raw('; return Runtime.isMap(')
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
                .raw(') || Runtime.isPlainObject(')
                .raw(var_)
                .raw(') ? ')
                .raw(var_)
                .raw('[')
                .subcompile(this.getNode('attribute'))
                .raw('] : null);})()')
            ;

            return;
        }

        compiler.raw(`this.traceableMethod(Runtime.twingGetAttribute, ${this.getTemplateLine()}, this.source)(this.env, `);

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        compiler.subcompile(this.getNode('node'));

        compiler.raw(', ').subcompile(this.getNode('attribute'));

        // only generate optional arguments when needed (to make generated code more readable)
        let needFifth = env.hasExtension('TwingExtensionSandbox');
        let needFourth = needFifth || this.getAttribute('ignore_strict_check');
        let needThird = needFourth || this.getAttribute('is_defined_test');
        let needSecond = needThird || this.getAttribute('type') !== TwingTemplate.ANY_CALL;
        let needFirst = needSecond || this.hasNode('arguments');

        if (needFirst) {
            if (this.hasNode('arguments')) {
                compiler.raw(', ').subcompile(this.getNode('arguments'));
            }
            else {
                compiler.raw(', []');
            }
        }

        if (needSecond) {
            compiler.raw(', ').repr(this.getAttribute('type'));
        }

        if (needThird) {
            compiler.raw(', ').repr(this.getAttribute('is_defined_test'));
        }

        if (needFourth) {
            compiler.raw(', ').repr(this.getAttribute('ignore_strict_check'));
        }

        if (needFifth) {
            compiler.raw(', ').repr(env.hasExtension('TwingExtensionSandbox'));
        }

        compiler.raw(')');
    };
}
