import {Test} from "tape";
import TwingNodeExpressionConstant from "../../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../../compiler-stub";
import TwingNodeExpressionUnaryNeg from "../../../../../../src/node/expression/unary/neg";

const tap = require('tap');

tap.test('node/expression/unary/neg', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1);

        test.same(node.getNode('node'), expr);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('basic', function(test: Test) {
            let expr = new TwingNodeExpressionConstant(1, 1);
            let node = new TwingNodeExpressionUnaryNeg(expr, 1);

            test.same(compiler.compile(node).getSource(), ' -1');

            test.end();
        });

        test.test('with unary neg as body', function(test: Test) {
            let expr = new TwingNodeExpressionConstant(1, 1);
            let node = new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionUnaryNeg(expr, 1), 1);

            test.same(compiler.compile(node).getSource(), ' - -1');

            test.end();
        });

        test.end();
    });

    test.end();
});