import {Test} from "tape";
import TwingNodeExpressionConstant from "../../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../../compiler-stub";
import TwingNodeExpressionUnaryPos from "../../../../../../src/node/expression/unary/pos";
import TwingNodeType from "../../../../../../src/node-type";

const tap = require('tap');

tap.test('node/expression/unary/pos', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryPos(expr, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getType(), TwingNodeType.EXPRESSION_UNARY_POS);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryPos(expr, 1);

        test.same(compiler.compile(node).getSource(), ' +1');

        test.end();

    });

    test.end();
});