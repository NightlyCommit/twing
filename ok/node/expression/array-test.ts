import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";
import TwingNodeExpressionArray from "../../../src/node/expression/array";
import TwingMap from "../../../src/map";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/array', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(foo);

        let node = new TwingNodeExpressionArray(elements, 1);

        test.equal(foo, node.getNode(1));

        test.end()
    });

    test.test('testCompile', function (test) {
        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('foo', 1));

        let node = new TwingNodeExpressionArray(elements, 1);

        nodeTestCase.assertNodeCompilation(test, node, '{\'foo\': \'bar\', \'bar\': \'foo\'}');

        test.end();
    });
});