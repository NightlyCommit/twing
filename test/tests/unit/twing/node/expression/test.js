const TwingMap = require('../../../../../../lib/twing/map').TwingMap;
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingTestCompilerStub = require('../../../../../compiler-stub');
const TwingNode = require('../../../../../../lib/twing/node').TwingNode;
const TwingNodeExpressionTest = require('../../../../../../lib/twing/node/expression/test').TwingNodeExpressionTest;
const TwingTestEnvironmentStub = require('../../../../../environment-stub');
const TwingTest = require('../../../../../../lib/twing/test').TwingTest;
const TwingNodeExpressionTestNull = require('../../../../../../lib/twing/node/expression/test/null').TwingNodeExpressionTestNull;
const TwingNodeType = require('../../../../../../lib/twing/node-type').TwingNodeType;
const TwingTestLoaderStub = require('../../../../../loader-stub');

const tap = require('tap');

function twig_tests_test_barbar(string, arg1 = null, arg2 = null, args = []) {
}

function createTest(node, name, args = new TwingMap()) {
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
        let loader = new TwingTestLoaderStub();
        let environment = new TwingTestEnvironmentStub(loader);

        environment.addTest(new TwingTest('barbar', twig_tests_test_barbar, {is_variadic: true, need_context: true}));
        environment.addTest(new TwingTest('anonymous', function () {
        }));

        let compiler = new TwingTestCompilerStub(environment);

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant('foo', 1);
            let node = new TwingNodeExpressionTestNull(expr, 'null', new TwingNode(new TwingMap()), 1);

            test.same(compiler.compile(node).getSource(), '("foo" === null)');

            test.end();
        });

        test.test('test as an anonymous function', function (test) {
            let node = createTest(new TwingNodeExpressionConstant('foo', 1), 'anonymous', new TwingMap([
                [0, new TwingNodeExpressionConstant('foo', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getTest(\'anonymous\').getCallable()(...["foo", "foo"])');

            test.end();
        });

        test.test('arbitrary named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1);

            let node = createTest(string, 'barbar');

            test.same(compiler.compile(node).getSource(), 'await this.env.getTest(\'barbar\').getCallable()(...["abc"])');

            node = createTest(string, 'barbar', new TwingMap([
                ['foo', new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getTest(\'barbar\').getCallable()(...["abc", null, null, ["bar"]])');

            node = createTest(string, 'barbar', new TwingMap([
                [0, new TwingNodeExpressionConstant('1', 1)],
                [1, new TwingNodeExpressionConstant('2', 1)],
                [2, new TwingNodeExpressionConstant('3', 1)],
                ['foo', new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getTest(\'barbar\').getCallable()(...["abc", "1", "2", ["3", "bar"]])');

            test.end();
        });

        test.end();
    });

    test.end();
});
