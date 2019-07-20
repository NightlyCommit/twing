const {
    TwingParser,
    TwingSource,
    TwingErrorSyntax,
    TwingNodeExpressionArray,
    TwingNodeExpressionConstant,
    TwingNodeExpressionName,
    TwingNodeExpressionBinaryConcat,
    TwingExtension,
    TwingEnvironment,
    TwingExpressionParser,
    TwingToken,
    TwingTokenStream,
    TwingNodeExpressionHash,
    TwingFunction,
    TwingTest,
    TwingFilter
} = require('../../../../../build/index');

const TwingTestMockEnvironment = require('../../../../mock/environment');
const TwingTestMockLoader = require('../../../../mock/loader');

const tap = require('tape');
const sinon = require('sinon');

class TwingTestExpressionParserExtension extends TwingExtension {
    getOperators() {
        return [
            new Map([]),
            new Map([
                ['with-callable', {
                    callable: (parser, expr) => {
                        return new TwingNodeExpressionConstant('3');
                    },
                    precedence: 1
                }]
            ])
        ];
    }

    getFunctions() {
        let i = 0;

        return new Map([
            [i++, new TwingFunction('deprecated', () => {
            }, {
                deprecated: true
            })],
            [i++, new TwingFunction('deprecated_with_version', () => {
            }, {
                deprecated: 1
            })],
            [i++, new TwingFunction('deprecated_with_alternative', () => {
            }, {
                deprecated: true,
                alternative: 'alternative'
            })]
        ])
    }

    getTests() {
        return [
            new TwingTest('foo bar')
        ]
    }

    getFilters() {
        let i = 0;

        return new Map([
            [i++, new TwingFilter('deprecated', () => {
            }, {
                deprecated: true
            })],
            [i++, new TwingFilter('deprecated_with_version', () => {
            }, {
                deprecated: 1
            })],
            [i++, new TwingFilter('deprecated_with_alternative', () => {
            }, {
                deprecated: true,
                alternative: 'alternative'
            })]
        ])
    }
}

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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false});
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
                [0, new TwingNodeExpressionConstant(0, 1, 5)],
                [1, new TwingNodeExpressionConstant(1, 1, 5)],

                [2, new TwingNodeExpressionConstant(1, 1, 8)],
                [3, new TwingNodeExpressionConstant(2, 1, 8)]
            ]), 1, 5)
            ],

            // array with trailing ,
            ['{{ [1, 2, ] }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant(0, 1, 5)],
                [1, new TwingNodeExpressionConstant(1, 1, 5)],

                [2, new TwingNodeExpressionConstant(1, 1, 8)],
                [3, new TwingNodeExpressionConstant(2, 1, 8)]
            ]), 1, 5)
            ],

            // simple hash
            ['{{ {"a": "b", "b": "c"} }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1, 5)],
                [1, new TwingNodeExpressionConstant('b', 1, 10)],

                [2, new TwingNodeExpressionConstant('b', 1, 15)],
                [3, new TwingNodeExpressionConstant('c', 1, 20)]
            ]), 1, 5)
            ],

            // hash with trailing ,
            ['{{ {"a": "b", "b": "c", } }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1, 5)],
                [1, new TwingNodeExpressionConstant('b', 1, 10)],

                [2, new TwingNodeExpressionConstant('b', 1, 15)],
                [3, new TwingNodeExpressionConstant('c', 1, 20)]
            ]), 1, 5)
            ],

            // hash in an array
            ['{{ [1, {"a": "b", "b": "c"}] }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant(0, 1, 5)],
                [1, new TwingNodeExpressionConstant(1, 1, 5)],

                [2, new TwingNodeExpressionConstant(1, 1, 9)],
                [3, new TwingNodeExpressionArray(new Map([
                    [0, new TwingNodeExpressionConstant('a', 1, 9)],
                    [1, new TwingNodeExpressionConstant('b', 1, 14)],

                    [2, new TwingNodeExpressionConstant('b', 1, 19)],
                    [3, new TwingNodeExpressionConstant('c', 1, 24)]
                ]), 1, 9)]
            ]), 1, 5)
            ],

            // array in a hash
            ['{{ {"a": [1, 2], "b": "c"} }}', new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('a', 1, 5)],
                [1, new TwingNodeExpressionArray(new Map([
                    [0, new TwingNodeExpressionConstant(0, 1, 11)],
                    [1, new TwingNodeExpressionConstant(1, 1, 11)],

                    [2, new TwingNodeExpressionConstant(1, 1, 14)],
                    [3, new TwingNodeExpressionConstant(2, 1, 14)]
                ]), 1, 11)],
                [2, new TwingNodeExpressionConstant('b', 1, 18)],
                [3, new TwingNodeExpressionConstant('c', 1, 23)]
            ]), 1, 5)
            ],
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
            ['{{ "foo" }}', new TwingNodeExpressionConstant('foo', 1, 4)],
            ['{{ "foo #{bar}" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionConstant('foo ', 1, 5),
                new TwingNodeExpressionName('bar', 1, 11),
                1, 11
            )
            ],
            ['{{ "foo #{bar} baz" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionBinaryConcat(
                    new TwingNodeExpressionConstant('foo ', 1, 5),
                    new TwingNodeExpressionName('bar', 1, 11),
                    1, 11
                ),
                new TwingNodeExpressionConstant(' baz', 1, 15),
                1, 15
            )
            ],
            ['{{ "foo #{"foo #{bar} baz"} baz" }}', new TwingNodeExpressionBinaryConcat(
                new TwingNodeExpressionBinaryConcat(
                    new TwingNodeExpressionConstant('foo ', 1, 5),
                    new TwingNodeExpressionBinaryConcat(
                        new TwingNodeExpressionBinaryConcat(
                            new TwingNodeExpressionConstant('foo ', 1, 12),
                            new TwingNodeExpressionName('bar', 1, 18),
                            1, 18
                        ),
                        new TwingNodeExpressionConstant(' baz', 1, 22),
                        1, 22
                    ),
                    1, 22
                ),
                new TwingNodeExpressionConstant(' baz', 1, 28), 1, 28)
            ]
        ];

        let loader = new TwingTestMockLoader();
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
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
        let env = new TwingTestMockEnvironment(loader, {cache: false, autoescape: false, optimizations: 0});
        let source = new TwingSource('{{ 1 is foobar}}', 'index');
        let stream = env.tokenize(source);
        let parser = new TwingParser(env);

        test.throws(function () {
            parser.parse(stream);
        }, new TwingErrorSyntax('Unknown "foobar" test.', 1, source), 'should throw a TwingErrorSyntax');

        test.end();
    });

    test.test('parseExpression', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        env.addExtension(new TwingTestExpressionParserExtension());

        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.NUMBER_TYPE, '1', 1),
            new TwingToken(TwingToken.OPERATOR_TYPE, 'with-callable', 1),
            new TwingToken(TwingToken.NUMBER_TYPE, '2', 1),
            new TwingToken(TwingToken.VAR_END_TYPE, null, 1)
        ]);

        let parser = new TwingParser(env);

        Reflect.set(parser, 'stream', stream);

        let expressionParser = new TwingExpressionParser(parser, env);
        let expression = expressionParser.parseExpression();

        test.true(expression instanceof TwingNodeExpressionConstant);
        test.looseEqual(expression.getAttribute('value'), 3);

        test.end();
    });

    test.test('getFunctionNode', function (test) {
        let env = new TwingTestMockEnvironment(new TwingTestMockLoader());
        let parser = new TwingParser(env);

        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1),
            new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1),
            new TwingToken(TwingToken.VAR_END_TYPE, null, 1)
        ]);

        Reflect.set(parser, 'stream', stream);

        let expressionParser = new TwingExpressionParser(parser, env);

        test.test('attribute', function (test) {
            test.throws(function () {
                expressionParser.getFunctionNode('attribute', 1);
            }, new TwingErrorSyntax('The "attribute" function takes at least two arguments (the variable and the attributes).', 1, new TwingSource('', '')), 'should throw a TwingErrorSyntax');

            test.end();
        });

        test.test('parent', function (test) {
            let parser = new TwingParser(env);

            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1),
                new TwingToken(TwingToken.VAR_END_TYPE, null, 1)
            ]);

            Reflect.set(parser, 'stream', stream);

            sinon.stub(parser, 'getBlockStack').returns([]);

            let expressionParser = new TwingExpressionParser(parser, env);

            test.throws(function () {
                expressionParser.getFunctionNode('parent', 1);
            }, new TwingErrorSyntax('Calling "parent" outside a block is forbidden.', 1, new TwingSource('', '')), 'should throw a TwingErrorSyntax');

            test.end();
        });

        test.test('deprecated function', function (test) {
            let env = new TwingEnvironment(new TwingTestMockLoader());
            let parser = new TwingParser(env);

            sinon.stub(parser, 'getImportedSymbol').returns(null);

            env.addExtension(new TwingTestExpressionParserExtension());

            let testCases = [
                ['deprecated', false, 'Twing Function "deprecated" is deprecated in index at line 1.'],
                ['deprecated_with_version', false, 'Twing Function "deprecated_with_version" is deprecated since version 1 in index at line 1.'],
                ['deprecated_with_alternative', false, 'Twing Function "deprecated_with_alternative" is deprecated. Use "alternative" instead in index at line 1.'],
                ['deprecated', true, 'Twing Function "deprecated" is deprecated in index.html.twig at line 1.']
            ];

            for (let testCase of testCases) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1),
                    new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1),
                    new TwingToken(TwingToken.VAR_END_TYPE, null, 1)
                ], new TwingSource('', 'index', testCase[1] ? 'index.html.twig' : undefined));

                Reflect.set(parser, 'stream', stream);

                let expressionParser = new TwingExpressionParser(parser, env);

                let originalWrite = process.stdout.write;

                process.stdout.write = (chunk) => {
                    process.stdout.write = originalWrite;

                    test.same(chunk, testCase[2]);
                };

                expressionParser.getFunctionNode(testCase[0], 1);
            }

            test.end();
        });

        test.end();
    });

    test.test('parseHashExpression', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        test.test('with key as an expression', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '{', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1),
                new TwingToken(TwingToken.STRING_TYPE, '1', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ':', 1),
                new TwingToken(TwingToken.STRING_TYPE, 'bar', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '}', 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);
            let expression = expressionParser.parseHashExpression();

            test.true(expression instanceof TwingNodeExpressionHash);

            test.end();
        });

        test.test('with key as an expression', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '{', 1),
                new TwingToken(TwingToken.OPERATOR_TYPE, 'foo', 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            test.throws(function () {
                expressionParser.parseHashExpression();
            }, new TwingErrorSyntax('A hash key must be a quoted string, a number, a name, or an expression enclosed in parentheses (unexpected token "operator" of value "foo".', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.test('parseSubscriptExpression', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        test.test('with dot syntax and non-name/number token', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '.', 1),
                new TwingToken(TwingToken.STRING_TYPE, 'bar', 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            test.throws(function () {
                expressionParser.parseSubscriptExpression(new TwingNodeExpressionConstant('foo'));
            }, new TwingErrorSyntax('Expected name or number.', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.test('parseTestExpression', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        env.addExtension(new TwingTestExpressionParserExtension());

        test.test('with not existing 2-words test', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1),
                new TwingToken(TwingToken.NAME_TYPE, 'bar2', 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            test.throws(function () {
                expressionParser.parseTestExpression(new TwingNodeExpressionConstant(1, 1));
            }, new TwingErrorSyntax('Unknown "foo bar2" test. Did you mean "foo bar"?', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.test('parseArguments', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        test.test('with non-name named argument', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1),
                new TwingToken(TwingToken.NUMBER_TYPE, '5', 1),
                new TwingToken(TwingToken.OPERATOR_TYPE, '=', 1),
                new TwingToken(TwingToken.NUMBER_TYPE, '5', 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            test.throws(function () {
                expressionParser.parseArguments(true);
            }, new TwingErrorSyntax('A parameter name must be a string, "TwingNodeExpressionConstant" given.', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.test('parseFilterExpressionRaw', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        env.addExtension(new TwingTestExpressionParserExtension());

        test.test('deprecated filter', function (test) {
            let env = new TwingEnvironment(new TwingTestMockLoader());
            let parser = new TwingParser(env);

            env.addExtension(new TwingTestExpressionParserExtension());

            let testCases = [
                ['deprecated', false, 'Twing Filter "deprecated" is deprecated in index at line 1.'],
                ['deprecated_with_version', false, 'Twing Filter "deprecated_with_version" is deprecated since version 1 in index at line 1.'],
                ['deprecated_with_alternative', false, 'Twing Filter "deprecated_with_alternative" is deprecated. Use "alternative" instead in index at line 1.'],
                ['deprecated', true, 'Twing Filter "deprecated" is deprecated in index.html.twig at line 1.']
            ];

            for (let testCase of testCases) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingToken.NAME_TYPE, testCase[0], 1),
                    new TwingToken(TwingToken.EOF_TYPE, null, 1)
                ], new TwingSource('', 'index', testCase[1] ? 'index.html.twig' : undefined));

                Reflect.set(parser, 'stream', stream);

                let expressionParser = new TwingExpressionParser(parser, env);

                let originalWrite = process.stdout.write;

                process.stdout.write = (chunk) => {
                    process.stdout.write = originalWrite;

                    test.same(chunk, testCase[2]);
                };

                expressionParser.parseFilterExpressionRaw(new TwingNodeExpressionConstant(1, 1), testCase[0]);
            }

            test.end();
        });

        test.end();
    });

    test.test('parseArrow', function (test) {
        let env = new TwingEnvironment(new TwingTestMockLoader());

        test.test('returns null when closing parenthesis is missing', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1, 1),
                new TwingToken(TwingToken.STRING_TYPE, 'bar', 1, 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            let expr = expressionParser.parseArrow();

            test.same(expr, null);

            test.end();
        });

        test.test('returns null when arrow is missing', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1, 1),
                new TwingToken(TwingToken.STRING_TYPE, 'bar', 1, 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1, 1),
                new TwingToken(TwingToken.STRING_TYPE, '=>', 1, 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            let expr = expressionParser.parseArrow();

            test.same(expr, null);

            test.end();
        });

        test.test('with non-name token', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1, 1),
                new TwingToken(TwingToken.STRING_TYPE, 'bar', 1, 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1, 1),
                new TwingToken(TwingToken.ARROW_TYPE, '=>', 1, 1),
                new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
            ]);

            let parser = new TwingParser(env);

            Reflect.set(parser, 'stream', stream);

            let expressionParser = new TwingExpressionParser(parser, env);

            try {
                expressionParser.parseArrow();

                test.fail('should throw an error');
            }
            catch (e) {
                test.same(e.getMessage(), 'Unexpected token "string" of value "bar" at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
