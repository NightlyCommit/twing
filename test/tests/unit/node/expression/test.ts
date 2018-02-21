import {Test} from "tape";
import TwingMap from "../../../../../src/map";
import TwingNodeExpressionConstant from "../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNode from "../../../../../src/node";
import TwingNodeExpressionTest from "../../../../../src/node/expression/test";
import TwingTestEnvironmentStub from "../../../../environment-stub";
import TwingTest from "../../../../../src/test";
import TwingNodeExpressionTestNull from "../../../../../src/node/expression/test/null";
import TwingTestLoaderStub from "../../../../loader-stub";

const tap = require('tap');

function twig_tests_test_barbar(string: string, arg1: any = null, arg2: any = null, args: Array<any> = []) {
}

function createTest(node: TwingNode, name: string, args: TwingMap<any, TwingNode> = new TwingMap()) {
    return new TwingNodeExpressionTest(node, name, new TwingNode(args), 1);
}

tap.test('node/expression/test', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let name = new TwingNodeExpressionConstant('null', 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionTest(expr, name, args, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('arguments'), args);
        test.same(node.getAttribute('name'), name);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let loader = new TwingTestLoaderStub();
        let environment = new TwingTestEnvironmentStub(loader);

        environment.addTest(new TwingTest('barbar', twig_tests_test_barbar, {is_variadic: true, need_context: true}));
        environment.addTest(new TwingTest('anonymous', function () {}));

        let compiler = new TwingTestCompilerStub(environment);

        test.test('basic', function (test: Test) {
            let expr = new TwingNodeExpressionConstant('foo', 1);
            let node = new TwingNodeExpressionTestNull(expr, 'null', new TwingNode(new TwingMap()), 1);

            test.same(compiler.compile(node).getSource(), '("foo" === null)');

            test.end();
        });

        test.test('test as an anonymous function', function (test: Test) {
            let node = createTest(new TwingNodeExpressionConstant('foo', 1), 'anonymous', new TwingMap([
                [0, new TwingNodeExpressionConstant('foo', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'await this.env.getTest(\'anonymous\').getCallable()(...["foo", "foo"])');

            test.end();
        });

        test.test('arbitrary named arguments', function (test: Test) {
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