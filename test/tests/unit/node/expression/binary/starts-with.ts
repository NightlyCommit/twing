import {Test} from "tape";
import {TwingNodeExpressionConstant} from "../../../../../../src/node/expression/constant";
import {TwingTestCompilerStub} from "../../../../../compiler-stub";
import {TwingNodeExpressionBinaryStartsWith} from "../../../../../../src/node/expression/binary/starts-with";

const tap = require('tap');

tap.test('node/expression/binary/starts-with', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryStartsWith(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryStartsWith(left, right, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), '(() => {let left = 1; let right = 2; return typeof left === \'string\' && typeof right === \'string\' && (right.length < 1 || left.startsWith(right));})()');

        test.end();
    });

    test.end();
});