const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');
const {TwingNodeExpressionUnaryNot} = require("../../../../../../../build/node/expression/unary/not");
const {TwingNodeExpressionConstant} = require("../../../../../../../build/node/expression/constant");

tap.test('node/expression/unary/not', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1, 1);

        test.same(node.getNode('node'), expr);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1, 1);

        test.same(compiler.compile(node).getSource(), ' !1');

        test.end();

    });

    test.end();
});
