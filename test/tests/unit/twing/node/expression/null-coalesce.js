const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionName = require('../../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionNullCoalesce = require('../../../../../../lib/twing/node/expression/null-coalesce').TwingNodeExpressionNullCoalesce;
const TwingNodeType = require('../../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/null-coalesce', function (test) {
    test.test('constructor', function(test) {
        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1, 1);

        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(),1);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1, 1);

        test.same(compiler.compile(node).getSource(), `((!!(// line 1, column 1
(context.has("foo")) &&  !(// line 1, column 1
context.get("foo") === null))) ? (// line 1, column 1
context.get("foo")) : (2))`);
        test.same(node.getType(), TwingNodeType.EXPRESSION_NULL_COALESCE);
        test.end();
    });

    test.end();
});
