import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeText from "../../../../src/node/text";
import TwingNodeBlock from "../../../../src/node/block";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/block', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.BLOCK);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
async block_foo(context, blocks = new Twing.TwingMap()) {
    Twing.echo("foo");
}

`);

        test.end();
    });

    test.end();
});