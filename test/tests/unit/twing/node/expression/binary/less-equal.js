const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestCompilerStub = require('../../../../../../compiler-stub');
const TwingNodeExpressionBinaryLessEqual = require('../../../../../../../lib/twing/node/expression/binary/less-equal').TwingNodeExpressionBinaryLessEqual;

const tap = require('tap');

tap.test('node/expression/binary/less-equal', function (test) {
    test.test('constructor', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryLessEqual(left, right, 1);

        test.same(node.getNode('left'), left);
        test.same(node.getNode('right'), right);

        test.end();
    });

    test.test('compile', function (test) {
        let left = new TwingNodeExpressionConstant(1, 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionBinaryLessEqual(left, right, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), '(1 <= 2)');

        test.end();
    });

    test.end();
});
