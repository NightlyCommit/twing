import * as tape from 'tape';
import TwingNodeAutoEscape from "../../src/node/auto-escape";
import TwingNode from "../../src/node";
import TwingMap from "../../src/map";
import TwingNodeText from "../../src/node/text";
import TestNodeTestCase from "./test-case";

let nodeTestCase = new TestNodeTestCase();

tape('node/auto-escape', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let body = new TwingNode(new TwingMap([[0, new TwingNodeText('foo', 1)]]));
        let node = new TwingNodeAutoEscape(true, body, 1);

        test.equal(body, node.getNode('body'));
        test.true(node.getAttribute('value'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let body = new TwingNode(new TwingMap([[0, new TwingNodeText('foo', 1)]]));
        let node = new TwingNodeAutoEscape(true, body, 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\nthis.obEcho(\'foo\');');

        // test.true(r);

        test.end();
    });
});
