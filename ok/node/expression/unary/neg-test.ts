import * as tape from 'tape';
import TestNodeTestCase from "./../../test-case";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeExpressionBinaryAdd from "../../../../src/node/expression/binary/add";
import TwingNodeExpressionUnaryNeg from "../../../../src/node/expression/unary/neg";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/unary/neg', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1);

        test.equal(expr, node.getNode('node'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1);

        // single negation
        nodeTestCase.assertNodeCompilation(test, node, '-1');

        // double negation
        node = new TwingNodeExpressionUnaryNeg(node, 1);

        nodeTestCase.assertNodeCompilation(test, node, '- -1');

        test.end();
    });
});