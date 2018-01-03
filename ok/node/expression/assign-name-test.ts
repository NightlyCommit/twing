import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionAssignName from "../../../src/node/expression/assign-name";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/assign-name', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.equal('foo', node.getAttribute('name'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        nodeTestCase.assertNodeCompilation(test, node, 'context.get(\'foo\')');

        test.end();
    });
});