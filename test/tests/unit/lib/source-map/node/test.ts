import * as tape from 'tape';
import {TwingSource} from "../../../../../../src/lib/source";
import {TwingSourceMapNode} from "../../../../../../src/lib/source-map/node";

tape('source-map/node', (test) => {
    test.test('constructor', (test) => {
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