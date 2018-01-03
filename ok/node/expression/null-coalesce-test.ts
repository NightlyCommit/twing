import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionNullCoalesce from "../../../src/node/expression/null-coalesce";
import TwingNodeExpressionName from "../../../src/node/expression/name";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/null-coalesce', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let left = new TwingNodeExpressionName('foo', 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1);

        test.equal(left, node.getNode('expr2'));
        test.equal(right, node.getNode('expr3'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let left = new TwingNodeExpressionName('foo', 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1);

        nodeTestCase.assertNodeCompilation(test, node, '((// line 1\ncontext.get(\'foo\')) || (2))');

        test.end();
    });
});