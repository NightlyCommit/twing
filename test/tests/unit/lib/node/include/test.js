const {
    TwingNodeInclude,
    TwingNodeType,
    TwingNodeExpressionConstant,
    TwingNodeExpressionArray,
    TwingNodeExpressionConditional,
    TwingNodeExpressionHash
} = require('../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/include', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
        let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

        test.false(node.hasNode('variables'));
        test.same(node.getNode('expr'), expr);
        test.false(node.getAttribute('only'));

        let arrayNodes = new Map([
            [0, new TwingNodeExpressionConstant('foo', 1, 1)],
            [1, new TwingNodeExpressionConstant(true, 1, 1)]
        ]);

        let vars = new TwingNodeExpressionArray(arrayNodes, 1, 1);
        node = new TwingNodeInclude(expr, vars, true, false, 1, 1);

        test.same(node.getNode('variables'), vars);
        test.true(node.getAttribute('only'));
        test.same(node.getType(), TwingNodeType.INCLUDE);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
            let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, undefined, true, false, 1));
`);
            test.end();
        });

        test.test('with condition', function (test) {
            let expr = new TwingNodeExpressionConditional(
                new TwingNodeExpressionConstant(true, 1, 1),
                new TwingNodeExpressionConstant('foo', 1, 1),
                new TwingNodeExpressionConstant('foo', 1, 1),
                0, 1
            );
            let node = new TwingNodeInclude(expr, null, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, ((true) ? (\`foo\`) : (\`foo\`)), undefined, true, false, 1));
`);
            test.end();
        });

        test.test('with variables', function (test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);
            let node = new TwingNodeInclude(expr, vars, false, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), true, false, 1));
`);
            test.end();
        });

        test.test('with variables only', function (test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);

            let node = new TwingNodeInclude(expr, vars, true, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), false, false, 1));
`);
            test.end();
        });

        test.test('with only and no variables', function (test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);
            let node = new TwingNodeInclude(expr, null, true, false, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, undefined, false, false, 1));
`);
            test.end();
        });

        test.test('with ignore missing', function (test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1, 1);

            let hashNodes = new Map([
                [0, new TwingNodeExpressionConstant('foo', 1, 1)],
                [1, new TwingNodeExpressionConstant(true, 1, 1)]
            ]);

            let vars = new TwingNodeExpressionHash(hashNodes, 1, 1);

            let node = new TwingNodeInclude(expr, vars, true, true, 1, 1);

            test.same(compiler.compile(node).getSource(), `this.echo(this.include(context, this.source, \`foo.twig\`, new Map([[\`foo\`, true]]), false, true, 1));
`);
            test.end();
        });

        test.end();
    });

    test.end();
});
