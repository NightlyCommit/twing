import {Test} from "tape";
import {TwingNodeExpressionConstant} from "../../../../../../src/node/expression/constant";
import {TwingTestCompilerStub} from "../../../../../compiler-stub";
import {TwingNodeExpressionBinaryNotIn} from "../../../../../../src/node/expression/binary/not-in";

const tap = require('tap');

tap.test('node/expression/binary/not-in', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryNotIn(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryNotIn(left, right, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), '!Twing.twingInFilter(1, 2)');

        test.end();
    });

    test.end();
});