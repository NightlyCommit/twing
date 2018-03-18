const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeBlockReference = require('../../../../../lib/twing/node/block-reference').TwingNodeBlockReference;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/block-reference', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeBlockReference('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK_REFERENCE);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeBlockReference('foo', 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1
this.displayBlock(\'foo\', context, blocks);
`);

        test.end();
    });

    test.end();
});
