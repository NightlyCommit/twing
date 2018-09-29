const {
    TwingNodePrint,
    TwingNodeExpressionConstant,
    TwingNodeType
} = require('../../../../../../dist/index');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/print', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodePrint(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.PRINT);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
Runtime.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
