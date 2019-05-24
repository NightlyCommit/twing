const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingTestEnvironmentStub = require('../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../mock/loader');

const tap = require('tape');
const {TwingFunction} = require("../../../../../../build/function");
const {TwingNodeExpressionFunction} = require("../../../../../../build/node/expression/function");
const {TwingNodeExpressionConstant} = require("../../../../../../build/node/expression/constant");
const {TwingNode} = require("../../../../../../build/node");

function twig_tests_function_dummy() {
}

function twig_tests_function_barbar(arg1 = null, arg2 = null, args = []) {
}

function twig_tests_function_needs_source() {

}

function createFunction(name, args = new Map()) {
    return new TwingNodeExpressionFunction(name, new TwingNode(args), 1, 1);
}

tap.test('node/expression/function', function (test) {
    test.test('constructor', function (test) {
        let name = 'function';
        let args = new TwingNode();
        let node = new TwingNodeExpressionFunction(name, args, 1, 1);

        test.same(node.getAttribute('name'), name);
        test.same(node.getNode('arguments'), args);

        test.end();
    });

    test.test('compile', function (test) {
        let loader = new TwingTestMockLoader();
        let environment = new TwingTestEnvironmentStub(loader);
        environment.addFunction(new TwingFunction('foo', twig_tests_function_dummy, {}));
        environment.addFunction(new TwingFunction('bar', twig_tests_function_dummy, {needs_environment: true}));
        environment.addFunction(new TwingFunction('foofoo', twig_tests_function_dummy, {needs_context: true}));
        environment.addFunction(new TwingFunction('foobar', twig_tests_function_dummy, {
            needs_environment: true,
            needs_context: true
        }));
        environment.addFunction(new TwingFunction('barbar', twig_tests_function_barbar, {is_variadic: true}));
        environment.addFunction(new TwingFunction('anonymous', function () {
        }));
        environment.addFunction(new TwingFunction('needs_source', twig_tests_function_needs_source, {
            needs_source: true,
        }));

        let compiler = new TwingTestMockCompiler(environment);

        test.test('basic', function (test) {
            let node = createFunction('foo');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foo\').traceableCallable(1, this.getSourceContext())(...[])');

            node = createFunction('foo', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1, 1)],
                [1, new TwingNodeExpressionConstant('foobar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foo\').traceableCallable(1, this.getSourceContext())(...[\`bar\`, \`foobar\`])');

            node = createFunction('bar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'bar\').traceableCallable(1, this.getSourceContext())(...[this.env])');

            node = createFunction('bar', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'bar\').traceableCallable(1, this.getSourceContext())(...[this.env, \`bar\`])');

            node = createFunction('foofoo');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foofoo\').traceableCallable(1, this.getSourceContext())(...[context])');

            node = createFunction('foofoo', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foofoo\').traceableCallable(1, this.getSourceContext())(...[context, \`bar\`])');

            node = createFunction('foobar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foobar\').traceableCallable(1, this.getSourceContext())(...[this.env, context])');

            node = createFunction('foobar', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foobar\').traceableCallable(1, this.getSourceContext())(...[this.env, context, \`bar\`])');

            node = createFunction('needs_source');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'needs_source\').traceableCallable(1, this.getSourceContext())(...[this.source])');

            test.test('named arguments', function (test) {
                let node = createFunction('date', new Map([
                    ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1, 1)],
                    ['date', new TwingNodeExpressionConstant(0, 1, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'date\').traceableCallable(1, this.getSourceContext())(...[this.env, 0, \`America/Chicago\`])');

                test.end();
            });

            test.test('arbitrary named arguments', function (test) {
                let node = createFunction('barbar');

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.getSourceContext())(...[])');

                node = createFunction('barbar', new Map([
                    ['foo', new TwingNodeExpressionConstant('bar', 1, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.getSourceContext())(...[null, null, [\`bar\`]])');

                node = createFunction('barbar', new Map([
                    ['arg2', new TwingNodeExpressionConstant('bar', 1, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.getSourceContext())(...[null, \`bar\`])');

                node = createFunction('barbar', new Map([
                    [0, new TwingNodeExpressionConstant('1', 1, 1)],
                    [1, new TwingNodeExpressionConstant('2', 1, 1)],
                    [2, new TwingNodeExpressionConstant('3', 1, 1)],
                    ['foo', new TwingNodeExpressionConstant('bar', 1, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.getSourceContext())(...[\`1\`, \`2\`, [\`3\`, \`bar\`]])');

                test.end();
            });

            test.test('function as an anonymous function', function (test) {
                let node = createFunction('anonymous', new Map([
                    [0, new TwingNodeExpressionConstant('foo', 1, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'anonymous\').traceableCallable(1, this.getSourceContext())(...[\`foo\`])');

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});
