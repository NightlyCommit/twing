import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpression} from "./expression";
import {TwingMap} from "../map";
import {TwingNodeExpressionAssignName} from "./expression/assign-name";
import {TwingNodeForLoop} from "./for-loop";
import {TwingNodeIf} from "./if";
import {TwingCompiler} from "../compiler";

export class TwingNodeFor extends TwingNode {
    private loop: TwingNodeForLoop;

    constructor(keyTarget: TwingNodeExpressionAssignName, valueTarget: TwingNodeExpressionAssignName, seq: TwingNodeExpression, ifexpr: TwingNodeExpression = null, body: TwingNode, elseNode: TwingNode = null, lineno: number, tag: string = null) {
        let loop = new TwingNodeForLoop(lineno, tag);

        let bodyNodes = new TwingMap();

        bodyNodes.push(body);
        bodyNodes.push(loop);

        body = new TwingNode(bodyNodes);

        if (ifexpr) {
            let ifNodes = new TwingMap();

            ifNodes.push(ifexpr);
            ifNodes.push(body);

            body = new TwingNodeIf(new TwingNode(ifNodes), null, lineno, tag);
        }

        let nodes = new TwingMap();

        nodes.set('key_target', keyTarget);
        nodes.set('value_target', valueTarget);
        nodes.set('seq', seq);
        nodes.set('body', body);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        let attributes = new TwingMap();

        attributes.set('with_loop', true);
        attributes.set('ifexpr', ifexpr !== null);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.FOR;
        this.loop = loop;
    }

    compile(compiler: TwingCompiler) {
        compiler
            .addDebugInfo(this)
            .write("context.set('_parent', context.clone());\n\n")
            .write('await (async () => {\n')
            .indent()
            .write('let c = Twing.twingEnsureTraversable(')
            .subcompile(this.getNode('seq'))
            .raw(");\n\n")
            .write('if (c === context) {\n')
            .indent()
            .write("context.set('_seq', context.clone());\n")
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
                .write("context.set('loop', new Twing.TwingMap([\n")
                .write("  ['parent', context.get('_parent')],\n")
                .write("  ['index0', 0],\n")
                .write("  ['index', 1],\n")
                .write("  ['first', true]\n")
                .write("]));\n")
            ;

            if (!this.getAttribute('ifexpr')) {
                compiler
                    .write("if (Array.isArray(context.get('_seq')) || (typeof context.get('_seq') === 'object' && Twing.isCountable(context.get('_seq')))) {\n")
                    .indent()
                    .write("let length = Twing.count(context.get('_seq'));\n")
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
            .write("await Twing.each.bind(this)(context.get('_seq'), async (__key__, __value__) => {\n")
            .indent()
            .subcompile(this.getNode('key_target'), false)
            .raw(' = __key__;\n')
            .subcompile(this.getNode('value_target'), false)
            .raw(' = __value__;\n')
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
