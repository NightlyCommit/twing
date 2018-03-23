
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNode = require('../../../../../../lib/twing/node').TwingNode;
const TwingNodeExpressionTest = require('../../../../../../lib/twing/node/expression/test').TwingNodeExpressionTest;
const TwingTestEnvironmentStub = require('../../../../../mock/environment');
const TwingTest = require('../../../../../../lib/twing/test').TwingTest;
const TwingNodeExpressionTestNull = require('../../../../../../lib/twing/node/expression/test/null').TwingNodeExpressionTestNull;
const TwingNodeType = require('../../../../../../lib/twing/node').TwingNodeType;
const TwingTestMockLoader = require('../../../../../mock/loader');

const tap = require('tap');

function twig_tests_test_barbar(string, arg1 = null, arg2 = null, args = []) {
}

function createTest(node, name, args = new Map()) {
    return new TwingNodeExpressionTest(node, name, new TwingNode(args), 1);
}

tap.test('node/expression/test', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let name = new TwingNodeExpressionConstant('null', 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionTest(expr, name, args, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('arguments'), args);
        test.same(node.getAttribute('name'), name);
        test.same(node.getType(), TwingNodeType.EXPRESSION_TEST);

        test.end();
    });

    test.test('compile', function (test) {
        let loader = new TwingTestMockLoader();
        let environment = new TwingTestEnvironmentStub(loader);

        environment.addTest(new TwingTest('barbar', twig_tests_test_barbar, {is_variadic: true, need_context: true}));
        environment.addTest(new TwingTest('anonymous', function () {
        }));

        let compiler = new TwingTestMockCompiler(environment);

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant('foo', 1);
            let node = new TwingNodeExpressionTestNull(expr, 'null', new TwingNode(new Map()), 1);

            test.same(compiler.compile(node).getSource(), '("foo" === null)');

            test.end();
        });

        test.test('test as an anonymous function', function (test) {
            let node = createTest(new TwingNodeExpressionConstant('foo', 1), 'anonymous', new Map([
                [0, new TwingNodeExpressionConstant('foo', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'anonymous\').getCallable()(...["foo", "foo"])');

            test.end();
        });

        test.test('arbitrary named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1);

            let node = createTest(string, 'barbar');

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').getCallable()(...["abc"])');

            node = createTest(string, 'barbar', new Map([
                ['foo', new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').getCallable()(...["abc", null, null, ["bar"]])');

            node = createTest(string, 'barbar', new Map([
                [0, new TwingNodeExpressionConstant('1', 1)],
                [1, new TwingNodeExpressionConstant('2', 1)],
                [2, new TwingNodeExpressionConstant('3', 1)],
                ['foo', new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getTest(\'barbar\').getCallable()(...["abc", "1", "2", ["3", "bar"]])');

            test.end();
        });

        test.end();
    });

    test.end();
});
