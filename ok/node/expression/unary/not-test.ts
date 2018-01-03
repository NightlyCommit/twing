import * as tape from 'tape';
import TestNodeTestCase from "./../../test-case";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeExpressionUnaryNot from "../../../../src/node/expression/unary/not";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/unary/not', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        test.equal(expr, node.getNode('node'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        nodeTestCase.assertNodeCompilation(test, node, '!1');

        test.end();
    });
});