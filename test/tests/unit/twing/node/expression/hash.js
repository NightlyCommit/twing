const TwingMap = require('../../../../../../lib/twing/map').TwingMap;
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionHash = require('../../../../../../lib/twing/node/expression/hash').TwingNodeExpressionHash;

const tap = require('tap');

tap.test('node/expression/hash', function (test) {
    test.test('constructor', function (test) {
        let foo = new TwingNodeExpressionConstant('bar', 1);

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(foo);

        let node = new TwingNodeExpressionHash(elements, 1);

        test.same(node.getNode(1), foo);
        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let elements = new TwingMap();

        elements.push(new TwingNodeExpressionConstant('foo', 1));
        elements.push(new TwingNodeExpressionConstant('bar', 1));

        elements.push(new TwingNodeExpressionConstant('bar', 1));
        elements.push(new TwingNodeExpressionConstant('foo', 1));

        let node = new TwingNodeExpressionHash(elements, 1);

        test.same(compiler.compile(node).getSource(), 'new Twing.TwingMap([["foo", "bar"], ["bar", "foo"]])');
        test.end();
    });

    test.end();
});
