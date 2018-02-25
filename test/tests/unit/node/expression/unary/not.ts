import {Test} from "tape";
import {TwingNodeExpressionConstant} from "../../../../../../src/node/expression/constant";
import {TwingTestCompilerStub} from "../../../../../compiler-stub";
import {TwingNodeExpressionUnaryNot} from "../../../../../../src/node/expression/unary/not";

const tap = require('tap');

tap.test('node/expression/unary/not', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        test.same(node.getNode('node'), expr);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        test.same(compiler.compile(node).getSource(), ' !1');

        test.end();

    });

    test.end();
});