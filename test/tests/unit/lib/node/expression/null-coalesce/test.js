const {
    TwingNodeExpressionNullCoalesce,
    TwingNodeExpressionConstant,
    TwingNodeExpressionName,
    TwingNodeType
} = require('../../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/null-coalesce', function (test) {
    test.test('constructor', function(test) {
        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce([left, right], 1, 1);

        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(),1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce([left, right], 1, 1);

        test.same(compiler.compile(node).getSource(), `((!!((context.has(\`foo\`)) &&  !this.env.getTest(\'null\').traceableCallable(1, this.source)(...[context.get(\`foo\`)]))) ? (context.get(\`foo\`)) : (2))`);
        test.same(node.getType(), TwingNodeType.EXPRESSION_NULL_COALESCE);
        test.end();
    });

    test.end();
});
