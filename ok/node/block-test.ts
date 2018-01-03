import * as tape from 'tape';
import TwingNodeAutoEscape from "../../src/node/auto-escape";
import TwingNode from "../../src/node";
import TwingMap from "../../src/map";
import TwingNodeText from "../../src/node/text";
import TestNodeTestCase from "./test-case";
import TwingNodeBlockReference from "../../src/node/block-reference";
import TwingNodeBlock from "../../src/node/block";

let nodeTestCase = new TestNodeTestCase();

tape('node/block', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let body= new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);

        test.equal(node.getAttribute('name'), 'foo');

        test.end()
    });

    test.test('testCompile', function (test) {
        let body= new TwingNodeText('foo', 1);
        let node = new TwingNodeBlock('foo', body, 1);

        nodeTestCase.assertNodeCompilation(test, node,
            '// line 1\n' +
            'public function block_foo(context, blocks = [])\n' +
            '{\n' +
            '    this.obEcho(\'foo\');\n' +
            '}');

        test.end();
    });
});