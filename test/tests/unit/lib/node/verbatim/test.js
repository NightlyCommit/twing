const {
    TwingNodeVerbatim,
    TwingNodeType
} = require('../../../../../../build/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/verbatim', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.getType(), TwingNodeType.VERBATIM);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);
        test.same(node.getNodeTag(), 'verbatim');

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeVerbatim('foo', 1, 1, 'verbatim');
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `this.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
