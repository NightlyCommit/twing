import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeBlockReference from "../../../../src/node/block-reference";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/block-reference', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeBlockReference('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK_REFERENCE);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let node = new TwingNodeBlockReference('foo', 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
await this.displayBlock(\'foo\', context, blocks);
`);

        test.end();
    });

    test.end();
});