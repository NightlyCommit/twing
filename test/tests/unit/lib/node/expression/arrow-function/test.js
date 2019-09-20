const {TwingNodeExpressionArrowFunction} = require('../../../../../../../build/lib/node/expression/arrow-function');
const {TwingNodeExpressionConstant} = require('../../../../../../../build/lib/node/expression/constant');
const {TwingNodeExpressionAssignName} = require('../../../../../../../build/lib/node/expression/assign-name');
const {TwingNode} = require('../../../../../../../build/lib/node');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/arrow-function', function (test) {
    test.test('constructor', function (test) {
        let names = new TwingNode(new Map([[0 ,new TwingNodeExpressionAssignName('a', 1, 1)]]));
        let node = new TwingNodeExpressionArrowFunction(new TwingNodeExpressionConstant('foo', 1, 1), names, 1, 1);

        test.same(node.getNode('names'), names);

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();
        let expected = `($__a__, $__b__) => {context.proxy['a'] = $__a__; context.proxy['b'] = $__b__; return \`foo\`;}`;

        let names = new TwingNode(new Map([
            [0 ,new TwingNodeExpressionAssignName('a', 1, 1)],
            [1 ,new TwingNodeExpressionAssignName('b', 1, 1)]
        ]));
        let node = new TwingNodeExpressionArrowFunction(new TwingNodeExpressionConstant('foo', 1, 1), names, 1, 1);

        test.same(compiler.compile(node).getSource(), expected);
        test.end();
    });

    test.end();
});
