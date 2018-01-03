import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";
import TwingNodeExpressionArray from "../../../src/node/expression/array";
import TwingMap from "../../../src/map";
import TwingNodeExpressionConditional from "../../../src/node/expression/conditional";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/constant', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let node = new TwingNodeExpressionConstant('foo', 1);

        test.equal('foo', node.getAttribute('value'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let node = new TwingNodeExpressionConstant('foo', 1);

        nodeTestCase.assertNodeCompilation(test, node, '\'foo\'');

        test.end();
    });
});