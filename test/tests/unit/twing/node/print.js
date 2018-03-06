const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodePrint = require('../../../../../lib/twing/node/print').TwingNodePrint;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/print', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodePrint(expr, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.PRINT);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1), 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});
