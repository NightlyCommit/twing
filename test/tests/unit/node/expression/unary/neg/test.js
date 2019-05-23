const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');
const {TwingNodeExpressionUnaryNeg} = require("../../../../../../../build/node/expression/unary/neg");
const {TwingNodeExpressionConstant} = require("../../../../../../../build/node/expression/constant");
const {TwingNodeType} = require("../../../../../../../build/node");

tap.test('node/expression/unary/neg', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getType(), TwingNodeType.EXPRESSION_UNARY_NEG);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant(1, 1, 1);
            let node = new TwingNodeExpressionUnaryNeg(expr, 1, 1);

            test.same(compiler.compile(node).getSource(), ' -1');

            test.end();
        });

        test.test('with unary neg as body', function (test) {
            let expr = new TwingNodeExpressionConstant(1, 1, 1);
            let node = new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionUnaryNeg(expr, 1, 1), 1, 1);

            test.same(compiler.compile(node).getSource(), ' - -1');

            test.end();
        });

        test.end();
    });

    test.end();
});
