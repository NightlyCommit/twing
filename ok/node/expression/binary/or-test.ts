import * as tape from 'tape';
import TestNodeTestCase from "./../../test-case";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeExpressionBinaryOr from "../../../../src/node/expression/binary/or";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/binary/or', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryOr(left, right, 1);

        test.equal(left, node.getNode('left'));
        test.equal(right, node.getNode('right'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryOr(left, right, 1);

        nodeTestCase.assertNodeCompilation(test, node, '(1 || 2)');

        test.end();
    });
});