const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const TwingNodeExpressionAssignName = require('../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeSet = require('../../../../../lib/twing/node/set').TwingNodeSet;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingNodePrint = require('../../../../../lib/twing/node/print').TwingNodePrint;
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

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
    Twing.obStart();
    Twing.echo(\`foo\`);
    context.set(\`foo\`, ((tmp = Twing.obGetClean()) === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset()));
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
    context.set(\`foo\`, ((tmp = \`foo\`) === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset()));
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
