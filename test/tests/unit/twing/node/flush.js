
const TwingNodeFlush = require('../../../../../lib/twing/node/flush').TwingNodeFlush;
const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

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

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
Twing.flush();
`);

        test.end();
    });

    test.end();
});
