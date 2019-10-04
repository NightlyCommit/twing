import * as tape from 'tape';
import {TwingNodeBlockReference} from "../../../../../../src/lib/node/block-reference";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/block-reference', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeBlockReference('foo', 1, 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK_REFERENCE);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeBlockReference('foo', 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `this.traceableDisplayBlock(1, this.source)(\'foo\', context.clone(), blocks);
`);

        test.end();
    });

    test.end();
});
