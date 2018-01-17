import TwingNode from "../node";
import TwingNodeExpression from "./expression";
import TwingMap from "../map";
import TwingNodeExpressionAssignName from "./expression/assign-name";
import TwingNodeForLoop from "./for-loop";
import TwingNodeIf from "./if";
import TwingTemplate from "../template";

import ensureTraversable from '../util/ensure-iterable';
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";

class TwingNodeFor extends TwingNode {
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

        this.loop = loop;
    }

    compile(compiler: TwingCompiler) {
        let elseHandler: DoDisplayHandler;
        let seqHandler: DoDisplayHandler = compiler.subcompile(this.getNode('seq'));
        let bodyHandler: DoDisplayHandler = compiler.subcompile(this.getNode('body'));

        if (this.hasNode('else')) {
            elseHandler = compiler.subcompile(this.getNode('else'));
        }

        this.loop.setAttribute('else', this.hasNode('else'));
        this.loop.setAttribute('with_loop', this.getAttribute('with_loop'));
        this.loop.setAttribute('ifexpr', this.getAttribute('ifexpr'));

        let keyTargetHandler = compiler.subcompile(this.getNode('key_target'));
        let valueTargetHandler = compiler.subcompile(this.getNode('value_target'));

        return (template: TwingTemplate, context: any, blocks: any) => {
            let result = '';

            context['_parent'] = Object.assign({}, context);
            context['_seq'] = ensureTraversable(seqHandler(template, context, blocks));

            if (elseHandler) {
                context['_iterated'] = false;
            }

            if (this.getAttribute('with_loop')) {
                context['loop'] = {
                    parent: context['_parent'],
                    index0: 0,
                    index: 1,
                    first: true
                };

                if (!this.getAttribute('ifexpr')) {
                    let length = Array.from(context['_seq'].values()).length;

                    context['loop']['revindex0'] = length - 1;
                    context['loop']['revindex'] = length;
                    context['loop']['length'] = length;
                    context['loop']['last'] = (length === 1);
                }
            }

            for (let [key, value] of context['_seq']) {
                keyTargetHandler(template, context, blocks).value = key;
                valueTargetHandler(template, context, blocks).value = value;

                result += bodyHandler(template, context, blocks);
            }

            if (elseHandler) {
                if (!context['_iterated']) {
                    result += elseHandler(template, context, blocks);
                }
            }

            let _parent = context['_parent'];

            // remove some 'private' loop variables (needed for nested loops)
            delete (context['_seq']);
            delete (context['_iterated']);
            delete (context[this.getNode('key_target').getAttribute('name')]);
            delete (context[this.getNode('value_target').getAttribute('name')]);
            delete (context['_parent']);
            delete (context['loop']);

            // keep the values set in the inner context for variables defined in the outer context
            // context = merge(context, array_intersect_key(context, _parent));
            for (let k in _parent) {
                if (!Reflect.has(context, k)) {
                    context[k] = _parent[k];
                }
            }

            return result;
        };
    }
}

export default TwingNodeFor;