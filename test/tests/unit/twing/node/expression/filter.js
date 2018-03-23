const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNode = require('../../../../../../lib/twing/node').TwingNode;
const TwingNodeExpressionFilter = require('../../../../../../lib/twing/node/expression/filter').TwingNodeExpressionFilter;
const TwingTestEnvironmentStub = require('../../../../../mock/environment');
const TwingFilter = require('../../../../../../lib/twing/filter').TwingFilter;

const TwingErrorSyntax = require('../../../../../../lib/twing/error/syntax').TwingErrorSyntax;
const TwingTestMockLoader = require('../../../../../mock/loader');

const tap = require('tap');

function twig_tests_filter_dummy() {
}

function twig_tests_filter_barbar(context, string, arg1 = null, arg2 = null, args = []) {
}

function createFilter(node, name, args = new Map()) {
    let nameNode = new TwingNodeExpressionConstant(name, 1);
    let argumentsNode = new TwingNode(args);

    return new TwingNodeExpressionFilter(node, nameNode, argumentsNode, 1);
}

tap.test('node/expression/filter', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let name = new TwingNodeExpressionConstant('upper', 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionFilter(expr, name, args, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('filter'), name);
        test.same(node.getNode('arguments'), args);

        test.end();
    });

    test.test('compile', function (test) {
        let loader = new TwingTestMockLoader();
        let environment = new TwingTestEnvironmentStub(loader);
        environment.addFilter(new TwingFilter('bar', twig_tests_filter_dummy, {needs_environment: true}));
        environment.addFilter(new TwingFilter('barbar', twig_tests_filter_barbar, {
            needs_context: true,
            is_variadic: true
        }));
        environment.addFilter(new TwingFilter('anonymous', function () {
        }));

        let compiler = new TwingTestMockCompiler(environment);

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant('foo', 1);
            let node = createFilter(expr, 'upper');

            let argsNodes = new Map([
                [0, new TwingNodeExpressionConstant(2, 1)],
                [1, new TwingNodeExpressionConstant('.', 1)],
                [2, new TwingNodeExpressionConstant(',', 1)]
            ]);

            node = createFilter(node, 'number_format', argsNodes);

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'number_format\').getCallable()(...[this.env, this.env.getFilter(\'upper\').getCallable()(...[this.env, "foo"]), 2, ".", ","])');

            test.end();
        });

        test.test('named arguments', function (test) {
            let date = new TwingNodeExpressionConstant(0, 1);
            let node = createFilter(date, 'date', new Map([
                ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1)],
                ['format', new TwingNodeExpressionConstant('d/m/Y H:i:s P', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'date\').getCallable()(...[this.env, 0, "d/m/Y H:i:s P", "America/Chicago"])');

            test.end();
        });

        test.test('skip an optional argument', function (test) {
            let date = new TwingNodeExpressionConstant(0, 1);
            let node = createFilter(date, 'date', new Map([
                ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'date\').getCallable()(...[this.env, 0, null, "America/Chicago"])');

            test.end();
        });

        test.test('underscores vs camelCase for named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1);
            let node = createFilter(string, 'reverse', new Map([
                ['preserve_keys', new TwingNodeExpressionConstant(true, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'reverse\').getCallable()(...[this.env, "abc", true])');

            string = new TwingNodeExpressionConstant('abc', 1);
            node = createFilter(string, 'reverse', new Map([
                ['preserveKeys', new TwingNodeExpressionConstant(true, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'reverse\').getCallable()(...[this.env, "abc", true])');

            test.end();
        });

        test.test('filter as an anonymous function', function (test) {
            let node = createFilter(new TwingNodeExpressionConstant('foo', 1), 'anonymous');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'anonymous\').getCallable()(...["foo"])');

            test.end();
        });

        test.test('needs environment', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1);
            let node = createFilter(string, 'bar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'bar\').getCallable()(...[this.env, "abc"])');

            let argsNodes = new Map([
                [0, new TwingNodeExpressionConstant('bar', 1)]
            ]);

            node = createFilter(string, 'bar', argsNodes);

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'bar\').getCallable()(...[this.env, "abc", "bar"])');

            test.end();
        });

        test.test('arbitrary named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1);
            let node = createFilter(string, 'barbar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').getCallable()(...[context, "abc"])');

            node = createFilter(string, 'barbar', new Map([['foo', new TwingNodeExpressionConstant('bar', 1)]]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').getCallable()(...[context, "abc", null, null, ["bar"]])');

            node = createFilter(string, 'barbar', new Map([['arg2', new TwingNodeExpressionConstant('bar', 1)]]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').getCallable()(...[context, "abc", null, "bar"])');

            node = createFilter(string, 'barbar', new Map([
                [0, new TwingNodeExpressionConstant('1', 1)],
                [1, new TwingNodeExpressionConstant('2', 1)],
                [2, new TwingNodeExpressionConstant('3', 1)],
                ['foo', new TwingNodeExpressionConstant('bar', 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').getCallable()(...[context, "abc", "1", "2", ["3", "bar"]])');

            test.end();
        });

        test.test('compileWithWrongNamedArgumentName', function (test) {
            let value = new TwingNodeExpressionConstant(0, 1);
            let node = createFilter(value, 'date', new Map([
                ['foobar', new TwingNodeExpressionConstant('America/Chicago', 1)]
            ]));

            test.throws(
                function () {
                    compiler.compile(node);
                }, new TwingErrorSyntax('Unknown argument "foobar" for filter "date(format, timezone)".', 1), 'should throw a TwingErrorSyntax'
            );

            test.end();
        });

        test.test('compileWithMissingNamedArgument', function (test) {
            let value = new TwingNodeExpressionConstant(0, 1);
            let node = createFilter(value, 'replace', new Map([
                ['to', new TwingNodeExpressionConstant('foo', 1)]
            ]));

            test.throws(
                function () {
                    compiler.compile(node);
                }, new TwingErrorSyntax('Value for argument "from" is required for filter "replace".'), 'should throw a TwingErrorSyntax'
            );

            test.end();
        });

        test.end();
    });

    test.end();
});
