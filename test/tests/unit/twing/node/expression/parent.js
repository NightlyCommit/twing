const TwingTestCompilerStub = require('../../../../../compiler-stub');
const TwingNodeExpressionParent = require('../../../../../../lib/twing/node/expression/parent').TwingNodeExpressionParent;
const TwingNodeType = require('../../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/parent', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_PARENT);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(compiler.compile(node).getSource(), 'await this.renderParentBlock("foo", context, blocks)');
        test.end();
    });

    test.end();
});
