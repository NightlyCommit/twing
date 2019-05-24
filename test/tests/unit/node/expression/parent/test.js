const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');
const {TwingNodeExpressionParent} = require("../../../../../../build/node/expression/parent");
const {TwingNodeType} = require("../../../../../../build/node");

tap.test('node/expression/parent', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionParent('foo', 1, 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_PARENT);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let node = new TwingNodeExpressionParent('foo', 1, 1);

        test.same(compiler.compile(node).getSource(), 'this.traceableRenderParentBlock(1, this.getSourceContext())(\`foo\`, context, blocks)');

        test.test('when name is not valid', function (test) {
            let node = new TwingNodeExpressionParent('£', 1, 1);

            test.same(compiler.compile(node).getSource(), 'this.traceableRenderParentBlock(1, this.getSourceContext())(\`c2a3\`, context, blocks)');

            test.end();
        });

        test.end();
    });

    test.end();
});
