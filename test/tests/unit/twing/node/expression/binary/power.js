const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../../mock/compiler');
const TwingNodeExpressionBinaryPower = require('../../../../../../../lib/twing/node/expression/binary/power').TwingNodeExpressionBinaryPower;

const tap = require('tap');

tap.test('node/expression/binary/power', function (test) {
    test.test('constructor', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryPower(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryPower(left, right, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), 'Math.pow(1, 2)');

        test.end();
    });

    test.end();
});
