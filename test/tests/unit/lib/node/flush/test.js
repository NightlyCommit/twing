const {
    TwingNodeFlush,
    TwingNodeType
} = require('../../../../../../build/main');

const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/flush', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeFlush(1, 1, 'foo');

        test.same(node.getNodes(), new Map());
        test.same(node.getType(), TwingNodeType.FLUSH);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeFlush(1, 1, 'foo');
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `this.flushOutputBuffer();
`);

        test.end();
    });

    test.end();
});
