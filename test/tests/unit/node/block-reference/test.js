const {TwingNodeType} = require('../../../../../build/node');
const {TwingNodeBlockReference} = require('../../../../../build/node/block-reference');

const TwingTestMockCompiler = require('../../../../mock/compiler');

const tap = require('tape');

tap.test('node/block-reference', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeBlockReference('foo', 1, 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK_REFERENCE);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeBlockReference('foo', 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
this.traceableDisplayBlock(1, this.source)(\'foo\', context, blocks);
`);

        test.end();
    });

    test.end();
});
