const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingMap = require('../../../../../lib/twing/map').TwingMap;
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingNodeAutoEscape = require('../../../../../lib/twing/node/auto-escape').TwingNodeAutoEscape;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/autoescape', function (test) {
    test.test('constructor', function (test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('foo', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1);

        test.same(node.getNode('body'), body);
        test.true(node.getAttribute('value'));
        test.same(node.getType(), TwingNodeType.AUTO_ESCAPE);

        test.end();
    });

    test.test('compile', function (test) {
        let bodyNodes = new TwingMap();

        bodyNodes.push(new TwingNodeText('foo', 1));

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});
