const TwingTestCompilerStub = require('../../../../compiler-stub');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeType = require('../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/text', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeText('foo', 1);

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.getType(), TwingNodeType.TEXT);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeText('foo', 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});
