import {Test} from "tape";
import TwingMap from "../../../../../src/map";
import TwingNodeExpressionConstant from "../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNodeExpressionHash from "../../../../../src/node/expression/hash";

const tap = require('tap');

tap.test('node/expression/hash', function (test: Test) {
    test.test('constructor', function(test: Test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(foo);

        let node = new TwingNodeExpressionHash(elements, 1);

        test.same(node.getNode(1), foo);
        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));

        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('foo', 1));

        let node = new TwingNodeExpressionHash(elements, 1);

        test.same(compiler.compile(node).getSource(), 'new Twing.TwingMap([["foo", "bar"], ["bar", "foo"]])');
        test.end();
    });

    test.end();
});