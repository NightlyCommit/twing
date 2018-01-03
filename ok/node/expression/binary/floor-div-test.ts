import * as tape from 'tape';
import TestNodeTestCase from "./../../test-case";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeExpressionBinaryFloorDiv from "../../../../src/node/expression/binary/floor-div";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/binary/floor-div', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryFloorDiv(left, right, 1);

        test.equal(left, node.getNode('left'));
        test.equal(right, node.getNode('right'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryFloorDiv(left, right, 1);

        nodeTestCase.assertNodeCompilation(test, node, 'Math.floor((1 / 2))');

        test.end();
    });
});