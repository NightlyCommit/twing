const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestCompilerStub = require('../../../../../compiler-stub');
const TwingNodeExpressionName = require('../../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionNullCoalesce = require('../../../../../../lib/twing/node/expression/null-coalesce').TwingNodeExpressionNullCoalesce;
const TwingNodeType = require('../../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/null-coalesce', function (test) {
    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();

        let left = new TwingNodeExpressionName('foo', 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1);

        test.same(compiler.compile(node).getSource(), `((!!(// line 1
(context.has("foo")) &&  !(context.get("foo") === null))) ? (context.get("foo")) : (2))`);
        test.same(node.getType(), TwingNodeType.EXPRESSION_NULL_COALESCE);
        test.end();
    });

    test.end();
});
