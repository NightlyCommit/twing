import {Test} from "tape";
import TwingNodeExpressionConstant from "../../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../../compiler-stub";
import TwingNodeExpressionBinaryMatches from "../../../../../../src/node/expression/binary/matches";

const tap = require('tap');

tap.test('node/expression/binary/matches', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryMatches(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryMatches(left, right, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), 'Twing.regexParser(2).test(1)');

        test.end();
    });

    test.end();
});