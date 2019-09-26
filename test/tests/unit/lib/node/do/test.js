const {
    TwingNodeText,
    TwingNodeExpressionConstant,
    TwingNodeDo,
    TwingNodeType
} = require('../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/do', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDo(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.DO);

        test.end();
    });

    test.test('compile', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDo(expr, 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `\`foo\`;
`);

        test.end();
    });

    test.end();
});
