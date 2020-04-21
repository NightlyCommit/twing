import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionAssignName} from "../../../../../../src/lib/node/expression/assign-name";
import {TwingNode, TwingNodeType} from "../../../../../../src/lib/node";
import {TwingNodeSet} from "../../../../../../src/lib/node/set";
import {MockCompiler} from "../../../../../mock/compiler";
import {TwingNodePrint} from "../../../../../../src/lib/node/print";
import {TwingNodeText} from "../../../../../../src/lib/node/text";

tape('node/set', (test) => {
    test.test('constructor', (test) => {
        let namesNodes = new Map([
            [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
        ]);

        let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

        let valuesNodes = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1, 1)]
        ]);

        let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

        let node = new TwingNodeSet(false, namesNode, valuesNode, 1, 1);

        test.same(node.getNode('names'), namesNode);
        test.same(node.getNode('values'), valuesNode);
        test.false(node.getAttribute('capture'));
        test.same(node.getType(), TwingNodeType.SET);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        test.test('basic', (test) => {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

            let valuesNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)]
            ]);

            let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

            let node = new TwingNodeSet(false, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `context.proxy[\`foo\`] = \`foo\`;
`);

            test.end();
        });

        test.test('with capture', (test) => {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

            let valuesNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1)]
            ]);

            let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `outputBuffer.start();
outputBuffer.echo(\`foo\`);
context.proxy[\`foo\`] = (() => {let tmp = outputBuffer.getAndClean(); return tmp === '' ? '' : new this.Markup(tmp, this.env.getCharset());})();
`);

            test.end();
        });

        test.test('with capture and text', (test) => {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);
            let valuesNode = new TwingNodeText('foo', 1, 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `context.proxy[\`foo\`] = await (async () => {let tmp = \`foo\`; return tmp === '' ? '' : new this.Markup(tmp, this.env.getCharset());})();
`);

            test.end();
        });

        test.test('with multiple names and values', (test) => {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)],
                [1, new TwingNodeExpressionAssignName('bar', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

            let valuesNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant('bar', 1, 1)]
            ]);

            let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

            let node = new TwingNodeSet(false, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `[context.proxy[\`foo\`], context.proxy[\`bar\`]] = [\`foo\`, \`bar\`];
`);

            test.end();
        });

        test.end();
    });

    test.end();
});
