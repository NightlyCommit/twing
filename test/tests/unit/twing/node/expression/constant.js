const TwingTestCompilerStub = require('../../../../../compiler-stub');
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');

tap.test('node/expression/constant', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionConstant('foo', 1);

        test.same(node.getAttribute('value'), 'foo');

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionConstant('foo', 1);

        test.same(compiler.compile(node).getSource(), '"foo"');
        test.end();
    });

    test.end();
});
