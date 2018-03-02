const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestCompilerStub = require('../../../../../../compiler-stub');
const TwingNodeExpressionUnaryNeg = require('../../../../../../../lib/twing/node/expression/unary/neg').TwingNodeExpressionUnaryNeg;
const TwingNodeType = require('../../../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/unary/neg', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getType(), TwingNodeType.EXPRESSION_UNARY_NEG);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant(1, 1);
            let node = new TwingNodeExpressionUnaryNeg(expr, 1);

            test.same(compiler.compile(node).getSource(), ' -1');

            test.end();
        });

        test.test('with unary neg as body', function (test) {
            let expr = new TwingNodeExpressionConstant(1, 1);
            let node = new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionUnaryNeg(expr, 1), 1);

            test.same(compiler.compile(node).getSource(), ' - -1');

            test.end();
        });

        test.end();
    });

    test.end();
});
