import {Test} from "tape";
import {TwingNodeExpressionConstant} from "../../../../../../src/node/expression/constant";
import {TwingTestCompilerStub} from "../../../../../compiler-stub";
import {TwingNodeExpressionBinaryBitwiseOr} from "../../../../../../src/node/expression/binary/bitwise-or";

const tap = require('tap');

tap.test('node/expression/binary/bitwise-or', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryBitwiseOr(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryBitwiseOr(left, right, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), '(1 | 2)');

        test.end();
    });

    test.end();
});