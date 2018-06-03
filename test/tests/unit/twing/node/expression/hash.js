
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionHash = require('../../../../../../lib/twing/node/expression/hash').TwingNodeExpressionHash;

const tap = require('tap');

tap.test('node/expression/hash', function (test) {
    test.test('constructor', function (test) {
        let foo = new TwingNodeExpressionConstant('bar', 1, 1);

        let elements = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1, 1)],
            [1, foo]
        ]);

        let node = new TwingNodeExpressionHash(elements, 1, 1);

        test.same(node.getNode(1), foo);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let elements = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1, 1)],
            [1, new TwingNodeExpressionConstant('bar', 1, 1)],
            [2, new TwingNodeExpressionConstant('bar', 1, 1)],
            [3, new TwingNodeExpressionConstant('foo', 1, 1)]
        ]);

        let node = new TwingNodeExpressionHash(elements, 1, 1);

        test.same(compiler.compile(node).getSource(), 'new Map([["foo", "bar"], ["bar", "foo"]])');
        test.end();
    });

    test.end();
});
