const {
    TwingNodeExpressionConstant,
    TwingNode,
    TwingFunction,
    TwingNodeExpressionFunction
} = require('../../../../../../../build/index');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');
const TwingTestEnvironmentStub = require('../../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../../mock/loader');

const tap = require('tape');

function twig_tests_function_dummy() {
}

function twig_tests_function_barbar(arg1 = null, arg2 = null, args = []) {
}

function createFunction(name, args = new Map()) {
    return new TwingNodeExpressionFunction(name, new TwingNode(args), 1);
}

tap.test('node/expression/function', function (test) {
    test.test('constructor', function (test) {
        let name = 'function';
        let args = new TwingNode();
        let node = new TwingNodeExpressionFunction(name, args, 1);

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

        let compiler = new TwingTestMockCompiler(environment);

        test.test('basic', function (test) {
            let node = createFunction('foo');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foo\').traceableCallable(1, this.source)(...[])');

            node = createFunction('foo', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1)],
                [1, new TwingNodeExpressionConstant('foobar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foo\').traceableCallable(1, this.source)(...[\`bar\`, \`foobar\`])');

            node = createFunction('bar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'bar\').traceableCallable(1, this.source)(...[this.env])');

            node = createFunction('bar', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'bar\').traceableCallable(1, this.source)(...[this.env, \`bar\`])');

            node = createFunction('foofoo');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foofoo\').traceableCallable(1, this.source)(...[context])');

            node = createFunction('foofoo', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foofoo\').traceableCallable(1, this.source)(...[context, \`bar\`])');

            node = createFunction('foobar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foobar\').traceableCallable(1, this.source)(...[this.env, context])');

            node = createFunction('foobar', new Map([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'foobar\').traceableCallable(1, this.source)(...[this.env, context, \`bar\`])');

            test.test('named arguments', function (test) {
                let node = createFunction('date', new Map([
                    ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1)],
                    ['date', new TwingNodeExpressionConstant(0, 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'date\').traceableCallable(1, this.source)(...[this.env, 0, \`America/Chicago\`])');

                test.end();
            });

            test.test('arbitrary named arguments', function (test) {
                let node = createFunction('barbar');

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.source)(...[])');

                node = createFunction('barbar', new Map([
                    ['foo', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.source)(...[null, null, [\`bar\`]])');

                node = createFunction('barbar', new Map([
                    ['arg2', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.source)(...[null, \`bar\`])');

                node = createFunction('barbar', new Map([
                    [0, new TwingNodeExpressionConstant('1', 1)],
                    [1, new TwingNodeExpressionConstant('2', 1)],
                    [2, new TwingNodeExpressionConstant('3', 1)],
                    ['foo', new TwingNodeExpressionConstant('bar', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'barbar\').traceableCallable(1, this.source)(...[\`1\`, \`2\`, [\`3\`, \`bar\`]])');

                test.end();
            });

            test.test('function as an anonymous function', function (test) {
                let node = createFunction('anonymous', new Map([
                    [0, new TwingNodeExpressionConstant('foo', 1)]
                ]));

                test.same(compiler.compile(node).getSource(), 'this.env.getFunction(\'anonymous\').traceableCallable(1, this.source)(...[\`foo\`])');

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});
