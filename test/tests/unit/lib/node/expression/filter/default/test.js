const {
    TwingNodeExpressionFilterDefault,
    TwingNodeExpressionName,
    TwingNodeExpressionConstant,
    TwingCompiler,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNode
} = require('../../../../../../../../build/main');

const tap = require('tape');

tap.test('node/expression/filter/default', function (test) {
    test.test('compile', function (test) {
        test.test('when filter is \`default\` and \`EXPRESSION_NAME\` or \`EXPRESSION_GET_ATTR\` node', function (test) {
            let node = new TwingNodeExpressionFilterDefault(
                new TwingNodeExpressionName('foo', 1, 1),
                new TwingNodeExpressionConstant('default', 1, 1),
                new TwingNode(),
                1, 1
            );

            let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

            test.same(compiler.compile(node).getSource(), `(((context.has(\`foo\`))) ? (this.env.getFilter('default').traceableCallable(1, this.source)(...[(context.has(\`foo\`) ? context.get(\`foo\`) : null)])) : (\`\`))`);

            test.end();
        });

        test.end();
    });

    test.end();
});
