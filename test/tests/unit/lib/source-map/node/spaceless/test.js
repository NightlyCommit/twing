const {
    TwingSourceMapNode,
    TwingSourceMapNodeSpaceless,
} = require('../../../../../../../build/index');

const tap = require('tape');

tap.test('source-map/node/spaceless', function (test) {
    class ChildSourceMapNode extends TwingSourceMapNode {
        constructor(content) {
            super(1, 0, 'foo.twig', 'text');

            this._content = content;
        }
    }

    test.test('should handle edge trimmjng and spaces between tags', function (test) {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, 'foo.twig');

        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('\n'));
        spacelessNode.addChild(new ChildSourceMapNode('f'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('>'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('>'));
        spacelessNode.addChild(new ChildSourceMapNode('f'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('<'));
        spacelessNode.addChild(new ChildSourceMapNode('>'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('\n'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('<'));
        spacelessNode.addChild(new ChildSourceMapNode('f'));
        spacelessNode.addChild(new ChildSourceMapNode('>'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('<'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('\n'));

        test.same(spacelessNode.toSourceNode().toString(), 'f > >f <><f><');

        test.end();
    });

    test.test('should support having only empty children', function (test) {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, 'foo.twig');

        spacelessNode.addChild(new ChildSourceMapNode(' \n'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('\n '));

        test.same(spacelessNode.toSourceNode().toString(), '');

        test.end();
    });

    test.test('should support not having children', function (test) {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, 'foo.twig');

        test.same(spacelessNode.toSourceNode().toString(), '');

        test.end();
    });

    test.end();
});