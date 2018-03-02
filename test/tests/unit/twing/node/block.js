const TwingTestCompilerStub = require('../../../../compiler-stub');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeBlock = require('../../../../../lib/twing/node/block').TwingNodeBlock;
const TwingNodeType = require('../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/block', function (test) {
    test.test('constructor', function (test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK);

        test.end();
    });

    test.test('compile', function (test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
async block_foo(context, blocks = new Twing.TwingMap()) {
    Twing.echo("foo");
}

`);

        test.end();
    });

    test.end();
});
