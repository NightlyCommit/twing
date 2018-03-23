const TwingTestEnvironmentStub = require('../../../mock/environment');
const TwingParser = require('../../../../lib/twing/parser').TwingParser;
const TwingSource = require('../../../../lib/twing/source').TwingSource;
const TwingErrorSyntax = require('../../../../lib/twing/error/syntax').TwingErrorSyntax;
const TwingNodeExpressionArray = require('../../../../lib/twing/node/expression/array').TwingNodeExpressionArray;

const TwingNodeExpressionConstant = require('../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeExpressionName = require('../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionBinaryConcat = require('../../../../lib/twing/node/expression/binary/concat').TwingNodeExpressionBinaryConcat;
const TwingTestMockLoader = require('../../../mock/loader');

const tap = require('tap');

tap.test('expression-parser', function (test) {
    test.test('canOnlyAssignToNames', function (test) {
        let templatesAndMessages = [
            ['{% set false = "foo" %}', 'You cannot assign a value to "false".'],
            ['{% set FALSE = "foo" %}', 'You cannot assign a value to "FALSE".'],
            ['{% set true = "foo" %}', 'You cannot assign a value to "true".'],
            ['{% set TRUE = "foo" %}', 'You cannot assign a value to "TRUE".'],
            ['{% set none = "foo" %}', 'You cannot assign a value to "none".'],
            ['{% set NONE = "foo" %}', 'You cannot assign a value to "NONE".'],
            ['{% set null = "foo" %}', 'You cannot assign a value to "null".'],
            ['{% set NULL = "foo" %}', 'You cannot assign a value to "NULL".'],
            ['{% set 3 = "foo" %}', 'Only variables can be assigned to. Unexpected token "number" of value "3" ("name" expected).'],
            ['{% set 1 + 2 = "foo" %}', 'Only variables can be assigned to. Unexpected token "number" of value "1" ("name" expected).'],
            ['{% set "bar" = "foo" %}', 'Only variables can be assigned to. Unexpected token "string" of value "bar" ("name" expected).'],
            ['{% set %}{% endset %})', 'Only variables can be assigned to. Unexpected token "end of statement block" of value "null" ("name" expected).']
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false});
        let parser = new TwingParser(env);

        for (let templateAndMessage of templatesAndMessages) {
            let source = new TwingSource(templateAndMessage[0], 'index');

            test.throws(function () {
                parser.parse(env.tokenize(source));
            }, new TwingErrorSyntax(templateAndMessage[1], 1, source), 'should throw a TwingErrorSyntax')
        }

        test.end();
    });

    test.test('arrayExpression', function (test) {
        let templatesAndNodes = [
            // simple array
            ['{{ [1, 2] }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant(0, 1)],
                [1, new TwingNodeExpressionConstant(1, 1)],

                [2, new TwingNodeExpressionConstant(1, 1)],
                [3, new TwingNodeExpressionConstant(2, 1)]
            ]), 1)
            ],

            // array with trailing ,
            ['{{ [1, 2, ] }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant(0, 1)],
                [1, new TwingNodeExpressionConstant(1, 1)],

                [2, new TwingNodeExpressionConstant(1, 1)],
                [3, new TwingNodeExpressionConstant(2, 1)]
            ]), 1)
            ],

            // simple hash
            ['{{ {"a": "b", "b": "c"} }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1)],
                [1, new TwingNodeExpressionConstant('b', 1)],

                [2, new TwingNodeExpressionConstant('b', 1)],
                [3, new TwingNodeExpressionConstant('c', 1)]
            ]), 1)
            ],

            // hash with trailing ,
            ['{{ {"a": "b", "b": "c", } }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1)],
                [1, new TwingNodeExpressionConstant('b', 1)],

                [2, new TwingNodeExpressionConstant('b', 1)],
                [3, new TwingNodeExpressionConstant('c', 1)]
            ]), 1)
            ],

            // hash in an array
            ['{{ [1, {"a": "b", "b": "c"}] }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant(0, 1)],
                [1, new TwingNodeExpressionConstant(1, 1)],

                [2, new TwingNodeExpressionConstant(1, 1)],
                [3, new TwingNodeExpressionArray(new Map([
                    [0, new TwingNodeExpressionConstant('a', 1)],
                    [1, new TwingNodeExpressionConstant('b', 1)],

                    [2, new TwingNodeExpressionConstant('b', 1)],
                    [3, new TwingNodeExpressionConstant('c', 1)]
                ]), 1)]
            ]), 1)
            ],

            // array in a hash
            ['{{ {"a": [1, 2], "b": "c"} }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1)],
                [1, new TwingNodeExpressionArray(new Map([
                    [0, new TwingNodeExpressionConstant(0, 1)],
                    [1, new TwingNodeExpressionConstant(1, 1)],

                    [2, new TwingNodeExpressionConstant(1, 1)],
                    [3, new TwingNodeExpressionConstant(2, 1)]
                ]), 1)],
                [2, new TwingNodeExpressionConstant('b', 1)],
                [3, new TwingNodeExpressionConstant('c', 1)]
            ]), 1)
            ],
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false});
        let parser = new TwingParser(env);

        for (let templateAndNodes of templatesAndNodes) {
            let stream = env.tokenize(new TwingSource(templateAndNodes[0], ''));

            let actual = parser.parse(stream)
                .getNode('body')
                .getNode(0)
                .getNode('expr');

            let expected = templateAndNodes[1];

            expected.setTemplateName('');

            test.same(actual, expected);
        }

        test.end();
    });

    test.test('arraySyntaxError', function (test) {
        let templatesAndMessages = [
            ['{{ [1, "a": "b"] }}', 'An array element must be followed by a comma. Unexpected token "punctuation" of value ":" ("punctuation" expected with value ",")'],
            ['{{ {"a": "b", 2} }}', 'A hash key must be followed by a colon (:). Unexpected token "punctuation" of value "}" ("punctuation" expected with value ":")']
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false});
        let parser = new TwingParser(env);

        for (let templateAndMessage of templatesAndMessages) {
            let source = new TwingSource(templateAndMessage[0], 'index');

            test.throws(function () {
                parser.parse(env.tokenize(source));
            }, new TwingErrorSyntax(templateAndMessage[1], 1, source), 'should throw a TwingErrorSyntax')
        }

        test.end();
    });

    test.test('stringExpressionDoesNotConcatenateTwoConsecutiveStrings', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ "a" "b" }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unexpected token "string" of value "b" ("end of print statement" expected).', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('stringExpression', function (test) {
        let templatesAndNodes = [
            ['{{ "foo" }}', new TwingNodeExpressionConstant('foo', 1)],
            ['{{ "foo #{bar}" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionConstant('foo ', 1),
                new TwingNodeExpressionName('bar', 1),
                1
            )
            ],
            ['{{ "foo #{bar} baz" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionBinaryConcat(
                    new TwingNodeExpressionConstant('foo ', 1),
                    new TwingNodeExpressionName('bar', 1),
                    1
                ),
                new TwingNodeExpressionConstant(' baz', 1),
                1
            )
            ],
            ['{{ "foo #{"foo #{bar} baz"} baz" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionBinaryConcat(
                    new TwingNodeExpressionConstant('foo ', 1),
                    new TwingNodeExpressionBinaryConcat(
                        new TwingNodeExpressionBinaryConcat(
                            new TwingNodeExpressionConstant('foo ', 1),
                            new TwingNodeExpressionName('bar', 1),
                            1
                        ),
                        new TwingNodeExpressionConstant(' baz', 1),
                        1
                    ),
                    1
                ),
                new TwingNodeExpressionConstant(' baz', 1),
                1
            )
            ]
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let parser = new TwingParser(env);

        for (let templateAndNodes of templatesAndNodes) {
            let stream = env.tokenize(new TwingSource(templateAndNodes[0], ''));

            let actual = parser.parse(stream)
                .getNode('body')
                .getNode(0)
                .getNode('expr');

            let expected = templateAndNodes[1];

            expected.setTemplateName('');

            test.same(actual, expected);
        }
        test.end();
    });

    test.test('attributeCallDoesNotSupportNamedArguments', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ foo.bar(name="Foo") }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Arguments must be separated by a comma. Unexpected token "operator" of value "=" ("punctuation" expected with value ",").', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('macroCallDoesNotSupportNamedArguments', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{% from _self import foo %}{% macro foo() %}{% endmacro %}{{ foo(name="Foo") }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Arguments must be separated by a comma. Unexpected token "operator" of value "=" ("punctuation" expected with value ",").', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('macroCallDoesNotSupportNamedArguments', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{% macro foo("a") %}{% endmacro %}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('An argument must be a name. Unexpected token "string" of value "a" ("name" expected).', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('macroDefinitionDoesNotSupportNonConstantDefaultValues', function (test) {
        let templates = [
            '{% macro foo(name = "a #{foo} a") %}{% endmacro %}',
            '{% macro foo(name = [["b", "a #{foo} a"]]) %}{% endmacro %}'
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let parser = new TwingParser(env);

        for (let template of templates) {
            let source = new TwingSource(template, 'index');
            let stream = env.tokenize(source);

            test.throws(function () {
                parser.parse(stream);
            }, new TwingErrorSyntax('A default value for an argument must be a constant (a boolean, a string, a number, or an array).', 1, source), 'should throw a TwingErrorSyntax');
        }

        test.end();
    });

    test.test('macroDefinitionSupportsConstantDefaultValues', function (test) {
        let templates = [
            '{% macro foo(name = "aa") %}{% endmacro %}',
            '{% macro foo(name = 12) %}{% endmacro %}',
            '{% macro foo(name = true) %}{% endmacro %}',
            '{% macro foo(name = ["a"]) %}{% endmacro %}',
            '{% macro foo(name = [["a"]]) %}{% endmacro %}',
            '{% macro foo(name = {a: "a"}) %}{% endmacro %}',
            '{% macro foo(name = {a: {b: "a"}}) %}{% endmacro %}'
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let parser = new TwingParser(env);

        for (let template of templates) {
            let source = new TwingSource(template, 'index');
            let stream = env.tokenize(source);

            test.ok(parser.parse(stream), 'should not throw an error');
        }

        test.end();
    });

    test.test('unknownFunction', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ cycl() }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "cycl" function. Did you mean "cycle"?', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('unknownFunctionWithoutSuggestions', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ foobar() }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "foobar" function.', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('unknownFilter', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{  1|lowe }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "lowe" filter. Did you mean "lower"?', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('unknownFilterWithoutSuggestions', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ 1|foobar }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "foobar" filter.', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('unknownTest', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{  1 is nul }}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "nul" test. Did you mean "null"?', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('unknownTestWithoutSuggestions', function (test) {
        let loader = new TwingTestMockLoader();
        let env = new TwingTestEnvironmentStub(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ 1 is foobar}}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "foobar" test.', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.end();
});
