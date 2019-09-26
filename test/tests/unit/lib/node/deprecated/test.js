const {
    TwingNodeExpressionConstant,
    TwingNodeExpressionName,
    TwingNodeDeprecated,
    TwingNodeType
} = require('../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/deprecated', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDeprecated(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.DEPRECATED);

        test.end();
    });

    test.test('compile', function (test) {
        test.test('with constant', function (test) {
            let expr = new TwingNodeExpressionConstant('foo', 1, 1);
            let node = new TwingNodeDeprecated(expr, 1, 1);
            let compiler = new TwingTestMockCompiler();

            node.setTemplateName('bar');

            test.same(compiler.compile(node).getSource(), `console.warn(\`foo\` + \` ("bar" at line 1)\`);
`);

            test.end();
        });

        test.test('with variable', function (test) {
            let expr = new TwingNodeExpressionName('foo', 1, 1);
            let node = new TwingNodeDeprecated(expr, 1, 1);
            let compiler = new TwingTestMockCompiler();

            node.setTemplateName('bar');

            test.same(compiler.compile(node).getSource(), `let __internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa = (context.has(\`foo\`) ? context.get(\`foo\`) : null);
console.warn(__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa + \` ("bar" at line 1)\`);
`);

            test.end();
        });

        test.end();
    });

    test.end();
});
