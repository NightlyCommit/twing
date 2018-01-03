import * as tape from 'tape';
import TwingNodeAutoEscape from "../../src/node/auto-escape";
import TwingNode from "../../src/node";
import TwingMap from "../../src/map";
import TwingNodeText from "../../src/node/text";
import TestNodeTestCase from "./test-case";

let nodeTestCase = new TestNodeTestCase();

tape('node/text', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let node = new TwingNodeText('foo', 1);

        test.equal(node.getAttribute('data'), 'foo');

        test.end()
    });

    test.test('testCompile', function (test) {
        let node = new TwingNodeText('foo', 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\nthis.obEcho(\'foo\');');

        test.end();
    });
});
