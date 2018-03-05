const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../../mock/compiler');
const TwingNodeExpressionUnaryPos = require('../../../../../../../lib/twing/node/expression/unary/pos').TwingNodeExpressionUnaryPos;
const TwingNodeType = require('../../../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/unary/pos', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryPos(expr, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getType(), TwingNodeType.EXPRESSION_UNARY_POS);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();
        let expr = new TwingNodeExpressionConstant(1, 1);
        let node = new TwingNodeExpressionUnaryPos(expr, 1);

        test.same(compiler.compile(node).getSource(), ' +1');

        test.end();

    });

    test.end();
});
