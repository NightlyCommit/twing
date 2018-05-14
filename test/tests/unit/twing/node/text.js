const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/text', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeText('foo', 1, 1);

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.getType(), TwingNodeType.TEXT);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeText('foo', 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});
