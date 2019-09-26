const {
    TwingNodeExpressionConstant,
    TwingNode,
    TwingNodeExpressionFilter,
    TwingFilter,
    TwingErrorSyntax
} = require('../../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../../mock/compiler');
const TwingTestEnvironmentStub = require('../../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../../mock/loader');

const tap = require('tape');

function twig_tests_filter_dummy() {
}

function twig_tests_filter_barbar(context, string, arg1 = null, arg2 = null, args = []) {
}

function createFilter(node, name, args = new Map()) {
    let nameNode = new TwingNodeExpressionConstant(name, 1, 1);
    let argumentsNode = new TwingNode(args);

    return new TwingNodeExpressionFilter(node, nameNode, argumentsNode, 1, 1);
}

tap.test('node/expression/filter', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let name = new TwingNodeExpressionConstant('upper', 1, 1);
        let args = new TwingNode();
        let node = new TwingNodeExpressionFilter(expr, name, args, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('filter'), name);
        test.same(node.getNode('arguments'), args);

        test.end();
    });

    test.test('compile', function (test) {
        let loader = new TwingTestMockLoader();
        let environment = new TwingTestEnvironmentStub(loader);
        environment.addFilter(new TwingFilter('bar', twig_tests_filter_dummy, [], {needs_environment: true}));
        environment.addFilter(new TwingFilter('barbar', twig_tests_filter_barbar, [
            {name: 'arg1', defaultValue: null},
            {name: 'arg2', defaultValue: null}
        ], {
            needs_context: true,
            is_variadic: true
        }));
        environment.addFilter(new TwingFilter('anonymous', function () {
        }, []));

        let compiler = new TwingTestMockCompiler(environment);

        test.test('basic', function (test) {
            let expr = new TwingNodeExpressionConstant('foo', 1, 1);
            let node = createFilter(expr, 'upper');

            let argsNodes = new Map([
                [0, new TwingNodeExpressionConstant(2, 1, 1)],
                [1, new TwingNodeExpressionConstant('.', 1, 1)],
                [2, new TwingNodeExpressionConstant(',', 1, 1)]
            ]);

            node = createFilter(node, 'number_format', argsNodes);

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'number_format\').traceableCallable(1, this.source)(...[this.env, this.env.getFilter(\'upper\').traceableCallable(1, this.source)(...[this.env, \`foo\`]), 2, \`.\`, \`,\`])');

            test.end();
        });

        test.test('named arguments', function (test) {
            let date = new TwingNodeExpressionConstant(0, 1, 1);
            let node = createFilter(date, 'date', new Map([
                ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1, 1)],
                ['format', new TwingNodeExpressionConstant('d/m/Y H:i:s P', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'date\').traceableCallable(1, this.source)(...[this.env, 0, \`d/m/Y H:i:s P\`, \`America/Chicago\`])');

            test.end();
        });

        test.test('skip an optional argument', function (test) {
            let date = new TwingNodeExpressionConstant(0, 1, 1);
            let node = createFilter(date, 'date', new Map([
                ['timezone', new TwingNodeExpressionConstant('America/Chicago', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'date\').traceableCallable(1, this.source)(...[this.env, 0, null, \`America/Chicago\`])');

            test.end();
        });

        test.test('underscores vs camelCase for named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1, 1);
            let node = createFilter(string, 'reverse', new Map([
                ['preserve_keys', new TwingNodeExpressionConstant(true, 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'reverse\').traceableCallable(1, this.source)(...[this.env, \`abc\`, true])');

            string = new TwingNodeExpressionConstant('abc', 1, 1);
            node = createFilter(string, 'reverse', new Map([
                ['preserveKeys', new TwingNodeExpressionConstant(true, 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'reverse\').traceableCallable(1, this.source)(...[this.env, \`abc\`, true])');

            test.end();
        });

        test.test('filter as an anonymous function', function (test) {
            let node = createFilter(new TwingNodeExpressionConstant('foo', 1, 1), 'anonymous');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'anonymous\').traceableCallable(1, this.source)(...[\`foo\`])');

            test.end();
        });

        test.test('needs environment', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1, 1);
            let node = createFilter(string, 'bar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'bar\').traceableCallable(1, this.source)(...[this.env, \`abc\`])');

            let argsNodes = new Map([
                [0, new TwingNodeExpressionConstant('bar', 1, 1)]
            ]);

            node = createFilter(string, 'bar', argsNodes);

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'bar\').traceableCallable(1, this.source)(...[this.env, \`abc\`, \`bar\`])');

            test.end();
        });

        test.test('arbitrary named arguments', function (test) {
            let string = new TwingNodeExpressionConstant('abc', 1, 1);
            let node = createFilter(string, 'barbar');

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').traceableCallable(1, this.source)(...[context, \`abc\`])');

            node = createFilter(string, 'barbar', new Map([['foo', new TwingNodeExpressionConstant('bar', 1, 1)]]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').traceableCallable(1, this.source)(...[context, \`abc\`, null, null, new Map([[\`foo\`, \`bar\`]])])');

            node = createFilter(string, 'barbar', new Map([['arg2', new TwingNodeExpressionConstant('bar', 1, 1)]]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').traceableCallable(1, this.source)(...[context, \`abc\`, null, \`bar\`])');

            node = createFilter(string, 'barbar', new Map([
                [0, new TwingNodeExpressionConstant('1', 1, 1)],
                [1, new TwingNodeExpressionConstant('2', 1, 1)],
                [2, new TwingNodeExpressionConstant('3', 1, 1)],
                ['foo', new TwingNodeExpressionConstant('bar', 1, 1)]
            ]));

            test.same(compiler.compile(node).getSource(), 'this.env.getFilter(\'barbar\').traceableCallable(1, this.source)(...[context, \`abc\`, \`1\`, \`2\`, new Map([[0, \`3\`], [\`foo\`, \`bar\`]])])');

            test.end();
        });

        test.test('compileWithWrongNamedArgumentName', function (test) {
            let value = new TwingNodeExpressionConstant(0, 1, 1);
            let node = createFilter(value, 'date', new Map([
                ['foobar', new TwingNodeExpressionConstant('America/Chicago', 1, 1)]
            ]));

            test.throws(
                function () {
                    compiler.compile(node);
                }, new TwingErrorSyntax('Unknown argument "foobar" for filter "date(format, timezone)".', 1), 'should throw a TwingErrorSyntax'
            );

            test.end();
        });

        test.test('compileWithMissingNamedArgument', function (test) {
            let value = new TwingNodeExpressionConstant(0, 1, 1);
            let node = createFilter(value, 'replace', new Map([
                ['to', new TwingNodeExpressionConstant('foo', 1, 1)]
            ]));

            test.throws(
                function () {
                    compiler.compile(node);
                }, new TwingErrorSyntax('Value for argument "from" is required for filter "replace".', 1), 'should throw a TwingErrorSyntax'
            );

            test.end();
        });

        test.end();
    });

    test.end();
});
