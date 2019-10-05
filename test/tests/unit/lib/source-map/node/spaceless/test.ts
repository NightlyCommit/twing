import * as tape from 'tape';
import {TwingSourceMapNode} from "../../../../../../../src/lib/source-map/node";
import {TwingSource} from "../../../../../../../src/lib/source";
import {TwingSourceMapNodeSpaceless} from "../../../../../../../src/lib/source-map/node/spaceless";

tape('source-map/node/spaceless', (test) => {
    class ChildSourceMapNode extends TwingSourceMapNode {
        constructor(content: string) {
            super(1, 0, new TwingSource('foo', 'foo.twig', 'foo.twig'), 'text');

            this._content = content;
        }
    }

    test.test('should handle edge trimmjng and spaces between tags', (test) => {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, new TwingSource('foo', 'foo.twig', 'foo.twig'));

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

    test.test('should support having only empty children', (test) => {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, new TwingSource('foo', 'foo.twig', 'foo.twig'));

        spacelessNode.addChild(new ChildSourceMapNode(' \n'));
        spacelessNode.addChild(new ChildSourceMapNode(' '));
        spacelessNode.addChild(new ChildSourceMapNode('\n '));

        test.same(spacelessNode.toSourceNode().toString(), '');

        test.end();
    });

    test.test('should support not having children', (test) => {
        let spacelessNode = new TwingSourceMapNodeSpaceless(1, 0, new TwingSource('foo', 'foo.twig', 'foo.twig'));

        test.same(spacelessNode.toSourceNode().toString(), '');

        test.end();
    });

    test.end();
});