import {Test} from "tape";
import {TwingMap} from "../../../../../src/map";
import {TwingNodeExpressionConstant} from "../../../../../src/node/expression/constant";
import {TwingNodeExpressionArray} from "../../../../../src/node/expression/array";
import {TwingTestCompilerStub} from "../../../../compiler-stub";
import {TwingNodeType} from "../../../../../src/node-type";

const tap = require('tap');

tap.test('node/expression/array', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(foo);

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(node.getNode(1), foo);
        test.same(node.getType(), TwingNodeType.EXPRESSION_ARRAY);
        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));

        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('foo', 1));

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(compiler.compile(node).getSource(), '["bar", "foo"]');
        test.end();
    });

    test.end();
});
