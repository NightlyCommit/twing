const {
    TwingSourceMapNode,
    TwingSource
} = require('../../../../../../dist/cjs/main');

const tap = require('tape');

tap.test('source-map/node', function (test) {
    test.test('constructor', function (test) {
        let source = new TwingSource('source', 'source.twig', 'source.twig');
        let node = new TwingSourceMapNode(1, 2, source, 'name');

        test.same(node.line, 1);
        test.same(node.column, 2);
        test.same(node.source, source);
        test.same(node.name, 'name');

        test.end();
    });

    test.end();
});