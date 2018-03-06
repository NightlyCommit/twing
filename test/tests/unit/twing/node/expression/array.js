const TwingMap = require('../../../../../../lib/twing/map').TwingMap;
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeExpressionArray = require('../../../../../../lib/twing/node/expression/array').TwingNodeExpressionArray;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeType = require('../../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/array', function (test) {
    test.test('constructor', function (test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(foo);

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(node.getNode(1), foo);
        test.same(node.getType(), TwingNodeType.EXPRESSION_ARRAY);
        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));

        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('foo', 1));

        let node = new TwingNodeExpressionArray(elements, 1);

        test.same(compiler.compile(node).getSource(), '["bar", "foo"]');
        test.end();
    });

    test.end();
});
