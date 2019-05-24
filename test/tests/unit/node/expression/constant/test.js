const TwingTestMockCompiler = require('../../../../../mock/compiler');
const {TwingNodeExpressionConstant} = require("../../../../../../build/node/expression/constant");

const tap = require('tape');

tap.test('node/expression/constant', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionConstant('foo', 1, 1);

        test.same(node.getAttribute('value'), 'foo');

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingTestMockCompiler();

        let node = new TwingNodeExpressionConstant('foo', 1, 1);

        test.same(compiler.compile(node).getSource(), '\`foo\`');
        test.end();
    });

    test.end();
});
