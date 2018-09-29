const {
    TwingNodeText,
    TwingNode,
    TwingNodeAutoEscape,
    TwingNodeType
} = require('../../../../../../dist/index');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/autoescape', function (test) {
    test.test('constructor', function (test) {
        let bodyNodes = new Map([
            [0, new TwingNodeText('foo', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1, 1);

        test.same(node.getNode('body'), body);
        test.true(node.getAttribute('value'));
        test.same(node.getType(), TwingNodeType.AUTO_ESCAPE);

        test.end();
    });

    test.test('compile', function (test) {
        let bodyNodes = new Map([
            [0, new TwingNodeText('foo', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeAutoEscape(true, body, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
Runtime.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
