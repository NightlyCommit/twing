import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";

import {TwingNodeExpressionAssignName} from "./expression/assign-name";
import {TwingNodeForLoop} from "./for-loop";
import {TwingNodeIf} from "./if";
import {TwingCompiler} from "../compiler";

export class TwingNodeFor extends TwingNode {
    private loop: TwingNodeForLoop;

    constructor(keyTarget: TwingNodeExpressionAssignName, valueTarget: TwingNodeExpressionAssignName, seq: TwingNodeExpression, ifexpr: TwingNodeExpression, body: TwingNode, elseNode: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let loop = new TwingNodeForLoop(lineno, columnno, tag);

        let bodyNodes = new Map();
        let i: number = 0;

        bodyNodes.set(i++, body);
        bodyNodes.set(i++, loop);

        body = new TwingNode(bodyNodes);

        if (ifexpr) {
            let ifNodes = new Map();
            let i: number = 0;

            ifNodes.set(i++, ifexpr);
            ifNodes.set(i++, body);

            body = new TwingNodeIf(new TwingNode(ifNodes), null, lineno, columnno, tag);
        }

        let nodes = new Map();

        nodes.set('key_target', keyTarget);
        nodes.set('value_target', valueTarget);
        nodes.set('seq', seq);
        nodes.set('body', body);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        let attributes = new Map();

        attributes.set('with_loop', true);
        attributes.set('ifexpr', ifexpr !== null);

        super(nodes, attributes, lineno, columnno, tag);

        this.type = TwingNodeType.FOR;
        this.loop = loop;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("context.set('_parent', Runtime.clone(context));\n\n")
            .write('(() => {\n')
            .indent()
            .write('let c = Runtime.twingEnsureTraversable(')
            .subcompile(this.getNode('seq'))
            .raw(");\n\n")
            .write('if (c === context) {\n')
            .indent()
            .write("context.set('_seq', Runtime.clone(context));\n")
            .outdent()
            .write("}\n")
            .write("else {\n")
            .indent()
            .write("context.set('_seq', c);\n")
            .outdent()
            .write("}\n")
            .outdent()
            .write("})();\n\n")
        ;

        if (this.hasNode('else')) {
            compiler.write("context.set('_iterated', false);\n");
        }

        if (this.getAttribute('with_loop')) {
            compiler
                .write("context.set('loop', new Map([\n")
                .write("  ['parent', context.get('_parent')],\n")
                .write("  ['index0', 0],\n")
                .write("  ['index', 1],\n")
                .write("  ['first', true]\n")
                .write("]));\n")
            ;

            if (!this.getAttribute('ifexpr')) {
                compiler
                    .write("if (Array.isArray(context.get('_seq')) || (typeof context.get('_seq') === 'object' && Runtime.isCountable(context.get('_seq')))) {\n")
                    .indent()
                    .write("let length = Runtime.count(context.get('_seq'));\n")
                    .write("let loop = context.get('loop');\n")
                    .write("loop.set('revindex0', length - 1);\n")
                    .write("loop.set('revindex', length);\n")
                    .write("loop.set('length', length);\n")
                    .write("loop.set('last', (length === 1));\n")
                    .outdent()
                    .write("}\n")
                ;
            }
        }

        this.loop.setAttribute('else', this.hasNode('else'));
        this.loop.setAttribute('with_loop', this.getAttribute('with_loop'));
        this.loop.setAttribute('ifexpr', this.getAttribute('ifexpr'));

        compiler
            .write("Runtime.each.bind(this)(context.get('_seq'), (__key__, __value__) => {\n")
            .indent()
            .write('context.set(')
            .subcompile(this.getNode('key_target'), true)
            .raw(', __key__);\n')
            .write('context.set(')
            .subcompile(this.getNode('value_target'), true)
            .raw(', __value__);\n')
            .subcompile(this.getNode('body'))
            .outdent()
            .write("});\n")
        ;

        if (this.hasNode('else')) {
            compiler
                .write("if (context.get('_iterated') === false) {\n")
                .indent()
                .subcompile(this.getNode('else'))
                .outdent()
                .write("}\n")
            ;
        }

        compiler
            .write("(() => {\n")
            .indent()
            .write(`let parent = context.get('_parent');\n`)
        ;

        // remove some "private" loop variables (needed for nested loops)
        compiler
            .write('context.delete(\'_seq\');\n')
            .write('context.delete(\'_iterated\');\n')
            .write('context.delete(\'' + this.getNode('key_target').getAttribute('name') + '\');\n')
            .write('context.delete(\'' + this.getNode('value_target').getAttribute('name') + '\');\n')
            .write('context.delete(\'_parent\');\n')
            .write('context.delete(\'loop\');\n')
        ;

        // keep the values set in the inner context for variables defined in the outer context
        compiler
            .write(`for (let [k, v] of parent) {\n`)
            .indent()
            .write('if (!context.has(k)) {\n')
            .indent()
            .write(`context.set(k, v);\n`)
            .outdent()
            .write('}\n')
            .outdent()
            .write('}\n')
        ;

        compiler
            .outdent()
            .write("})();\n")
        ;
    }
}
