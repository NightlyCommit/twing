const TwingTestMockCompiler = require('../../../../mock/compiler');
const tap = require('tape');
const {TwingNodePrint} = require("../../../../../build/node/print");
const {TwingNodeSet} = require("../../../../../build/node/set");
const {TwingNodeText} = require("../../../../../build/node/text");
const {TwingNodeExpressionAssignName} = require("../../../../../build/node/expression/assign-name");
const {TwingNodeExpressionConstant} = require("../../../../../build/node/expression/constant");
const {TwingNode, TwingNodeType} = require("../../../../../build/node");

tap.test('node/set', function (test) {
    test.test('constructor', function (test) {
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

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('basic', function (test) {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

            let valuesNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)]
            ]);

            let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

            let node = new TwingNodeSet(false, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set(\`foo\`, \`foo\`);
`);

            test.end();
        });

        test.test('with capture', function (test) {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);

            let valuesNodes = new Map([
                [0, new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1)]
            ]);

            let valuesNode = new TwingNode(valuesNodes, new Map(), 1, 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
(() => {
    let tmp;
    this.startOutputBuffering();
    this.echo(\`foo\`);
    context.set(\`foo\`, ((tmp = this.getAndCleanOutputBuffer()) === '') ? '' : this.createMarkup(tmp, this.env.getCharset()));
})();
`);

            test.end();
        });

        test.test('with capture and text', function (test) {
            let namesNodes = new Map([
                [0, new TwingNodeExpressionAssignName('foo', 1, 1)]
            ]);

            let namesNode = new TwingNode(namesNodes, new Map(), 1, 1);
            let valuesNode = new TwingNodeText('foo', 1, 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1, 1);

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
(() => {
    let tmp;
    context.set(\`foo\`, ((tmp = \`foo\`) === '') ? '' : this.createMarkup(tmp, this.env.getCharset()));
})();
`);

            test.end();
        });

        test.test('with multiple names and values', function (test) {
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

            test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set(\`foo\`, \`foo\`); context.set(\`bar\`, \`bar\`);
`);

            test.end();
        });

        test.end();
    });

    test.end();
});
