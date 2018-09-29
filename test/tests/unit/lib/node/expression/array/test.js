const {
    TwingNodeExpressionConstant,
    TwingNodeExpressionArray,
    TwingNodeType
} = require('../../../../../../../build/index');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/array', function (test) {
    test.test('constructor', function (test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1)],
            [1, foo]
        ]);

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(node.getNode(1), foo);
        test.same(node.getType(), TwingNodeType.EXPRESSION_ARRAY);
        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let elements = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1)],
            [1, new TwingNodeExpressionConstant('bar', 1)],
            [2, new TwingNodeExpressionConstant('bar', 1)],
            [3, new TwingNodeExpressionConstant('foo', 1)]
        ]);

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(compiler.compile(node).getSource(), '[\`bar\`, \`foo\`]');
        test.end();
    });

    test.end();
});
