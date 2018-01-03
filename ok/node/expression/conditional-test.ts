import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";
import TwingNodeExpressionArray from "../../../src/node/expression/array";
import TwingMap from "../../../src/map";
import TwingNodeExpressionConditional from "../../../src/node/expression/conditional";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/conditional', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let expr1 = new TwingNodeExpressionConstant(1, 1);
        let expr2 = new TwingNodeExpressionConstant(2, 1);
        let expr3 = new TwingNodeExpressionConstant(3, 1);

        let node = new TwingNodeExpressionConditional(expr1, expr2, expr3, 1);

        test.equal(expr1, node.getNode('expr1'));
        test.equal(expr2, node.getNode('expr2'));
        test.equal(expr3, node.getNode('expr3'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let expr1 = new TwingNodeExpressionConstant(1, 1);
        let expr2 = new TwingNodeExpressionConstant(2, 1);
        let expr3 = new TwingNodeExpressionConstant(3, 1);

        let node = new TwingNodeExpressionConditional(expr1, expr2, expr3, 1);

        nodeTestCase.assertNodeCompilation(test, node, '((1) ? (2) : (3))');

        test.end();
    });
});