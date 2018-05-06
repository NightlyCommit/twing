const TwingSourceMapNode = require('../../../../../lib/twing/source-map/node').TwingSourceMapNode;
const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('extension/source-map', function (test) {
    test.test('compile', function (test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingSourceMapNode(body);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});
