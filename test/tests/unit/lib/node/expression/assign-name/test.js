const {
    TwingNodeExpressionAssignName,
    TwingNodeType
} = require('../../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/assign-name', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_ASSIGN_NAME);
        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(compiler.compile(node).getSource(), 'context.proxy[\`foo\`]');
        test.end();
    });

    test.end();
});
