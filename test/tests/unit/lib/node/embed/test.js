const {
    TwingNodeEmbed,
    TwingCompiler,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeExpressionConstant
} = require('../../../../../../dist/cjs/main');

const tap = require('tape');

tap.test('node/embed', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeEmbed('foo', 1, new TwingNodeExpressionConstant('bar', 1, 1), false, false, 1, 1, 'embed');
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        test.same(compiler.compile(node).getSource(), `this.loadTemplate(\`foo\`, null, 1, 1).display(this.merge(context, \`bar\`));
`);

        test.end();
    });

    test.end();
});