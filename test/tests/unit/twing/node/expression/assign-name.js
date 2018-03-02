const TwingTestCompilerStub = require('../../../../../compiler-stub');
const TwingNodeExpressionAssignName = require('../../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeType = require('../../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/expression/assign-name', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_ASSIGN_NAME);
        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(compiler.compile(node).getSource(), 'Twing.getContextProxy(context)["foo"]');
        test.end();
    });

    test.end();
});
