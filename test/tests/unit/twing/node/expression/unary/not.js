const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestCompilerStub = require('../../../../../../compiler-stub');
const TwingNodeExpressionUnaryNot = require('../../../../../../../lib/twing/node/expression/unary/not').TwingNodeExpressionUnaryNot;

const tap = require('tap');

tap.test('node/expression/unary/not', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        test.same(node.getNode('node'), expr);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1);

        test.same(compiler.compile(node).getSource(), ' !1');

        test.end();

    });

    test.end();
});
