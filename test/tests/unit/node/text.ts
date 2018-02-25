import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../compiler-stub";
import {TwingNodeText} from "../../../../src/node/text";
import {TwingNodeType} from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/text', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeText('foo', 1);

        test.same(node.getAttribute('data'), 'foo');
        test.same(node.getType(), TwingNodeType.TEXT);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let node = new TwingNodeText('foo', 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo("foo");
`);

        test.end();
    });

    test.end();
});