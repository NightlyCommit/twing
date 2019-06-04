const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../build/environment/node');
const {TwingLexer} = require('../../../../build/lexer');
const {TwingToken, TwingTokenType} = require('../../../../build/token');
const {TwingSource} = require('../../../../build/source');
const {TwingErrorSyntax} = require('../../../../build/error/syntax');

const tap = require('tape');

let createLexer = function () {
    return new TwingLexer(new TwingEnvironment(null));
};

let testToken = (test, token, value, line, column, type = null) => {
    test.looseEqual(token.getContent(), value, token.getType() + ' value should be "' + ((value && value.length > 80) ? value.substr(0, 77) + '...' : value) + '"');
    test.same(token.getLine(), line, 'line should be ' + line);
    test.same(token.getColumn(), column, 'column should be ' + column);
    // test.same(token.getModifier(), modifier, 'modifier should be ' + modifier);

    if (type) {
        test.same(token.getType(), type, 'type should be "' + TwingToken.typeToEnglish(type) + '"');
    }
};

tap.test('lexer', function (test) {
    test.test('operator', function (test) {
        let data = '{{foo not    in bar}}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.NAME), 'foo', 1, 3);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 6);
        testToken(test, stream.expect(TwingTokenType.OPERATOR), 'not    in', 1, 7);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 16);
        testToken(test, stream.expect(TwingTokenType.NAME), 'bar', 1, 17);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 20);
        testToken(test, stream.getCurrent(), null, 1, 22, TwingTokenType.EOF);

        test.test('used as variable', function (test) {
            let data = '{{matches}}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.NAME), 'matches', 1, 3);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 10);
            testToken(test, stream.getCurrent(), null, 1, 12, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('string', function(test) {
        test.test('empty', function(test) {
            let data = '{{""}}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 3);
            testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 4);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 5);
            testToken(test, stream.getCurrent(), null, 1, 7, TwingTokenType.EOF);

            test.test('AST', function (test) {
                stream.rewind();
                stream = stream.toAst();

                testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
                testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 3);
                testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 4);
                testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 5);
                testToken(test, stream.getCurrent(), null, 1, 7, TwingTokenType.EOF);

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.test('testNameLabelForTag', function (test) {
        let data = '{% § %}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.NAME), '§', 1, 4);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 5);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 6);
        testToken(test, stream.getCurrent(), null, 1, 8, TwingTokenType.EOF);

        test.end();
    });

    test.test('testNameLabelForFunction', function (test) {
        let data = '{{ §() }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.NAME), '§', 1, 4);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '(', 1, 5);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ')', 1, 6);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 7);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 8);
        testToken(test, stream.getCurrent(), null, 1, 10, TwingTokenType.EOF);

        test.end();
    });

    test.test('testBracketsNesting', function (test) {
        let data = '{{ {"a":{"b":"c"}} }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '{', 1, 4);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 5);
        testToken(test, stream.expect(TwingTokenType.STRING), 'a', 1, 6);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 7);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ':', 1, 8);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '{', 1, 9);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 10);
        testToken(test, stream.expect(TwingTokenType.STRING), 'b', 1, 11);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 12);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ':', 1, 13);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 14);
        testToken(test, stream.expect(TwingTokenType.STRING), 'c', 1, 15);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 16);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '}', 1, 17);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '}', 1, 18);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 19);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 20);
        testToken(test, stream.getCurrent(), null, 1, 22, TwingTokenType.EOF);

        test.end();
    });

    test.test('verbatim', function (test) {
        test.test('multiple lines', function (test) {
            let template = `{% verbatim %}
    {{ "bla" }}
{% endverbatim %}`;

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            console.warn(stream);

            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'verbatim', 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 12);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 13);
            testToken(test, stream.expect(TwingTokenType.TEXT), '\n    {{ "bla" }}\n', 1, 15);
            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 3, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 3, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'endverbatim', 3, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 3, 15);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 3, 16);
            testToken(test, stream.getCurrent(), null, 3, 18, TwingTokenType.EOF);

            test.end();
        });

        test.test('long', function (test) {
            let template = '{% verbatim %}' + '*'.repeat(100000) + '{% endverbatim %}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));


            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'verbatim', 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 12);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 13);
            testToken(test, stream.expect(TwingTokenType.TEXT), '*'.repeat(100000), 1, 15);
            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 100015);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 100017);
            testToken(test, stream.expect(TwingTokenType.NAME), 'endverbatim', 1, 100018);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 100029);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 100030);
            testToken(test, stream.getCurrent(), null, 1, 100032, TwingTokenType.EOF);

            test.end();
        });

        test.test('unclosed', function (test) {
            let template = `{% verbatim %}{{ "bla" }}`;

            let lexer = createLexer();

            try {
                lexer.tokenize(new TwingSource(template, 'index'));

                test.fail('should throw a syntax error');
            } catch (e) {
                test.same(e.name, 'TwingErrorSyntax');
                test.same(e.getMessage(), 'Unexpected end of file: unclosed "verbatim" block in "index" at line 1.');

                test.end();
            }
        });

        test.end();
    });

    test.test('var', function (test) {
        test.test('without whitespaces', function (test) {
            let template = `{{bla}}`;

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.NAME), 'bla', 1, 3);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 6);
            testToken(test, stream.getCurrent(), null, 1, 8, TwingTokenType.EOF);

            test.end();
        });

        test.test('with whitespaces', function (test) {
            let template = `{{ 
bla }}`;

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' \n', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'bla', 2, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 2, 4);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 2, 5);
            testToken(test, stream.getCurrent(), null, 2, 7, TwingTokenType.EOF);

            test.end();
        });

        test.test('long', function (test) {
            let template = '{{ ' + 'x'.repeat(100000) + ' }}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'x'.repeat(100000), 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 100004);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 100005);
            testToken(test, stream.getCurrent(), null, 1, 100007, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('block', function (test) {
        test.test('multiple lines', function (test) {
            let template = `{%
bla
%}`;

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), '\n', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'bla', 2, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), '\n', 2, 4);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 3, 1);
            testToken(test, stream.getCurrent(), null, 3, 3, TwingTokenType.EOF);

            test.end();
        });

        test.test('long', function (test) {
            let template = '{% ' + 'x'.repeat(100000) + ' %}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NAME), 'x'.repeat(100000), 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 100004);
            testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 100005);
            testToken(test, stream.getCurrent(), null, 1, 100007, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('number', function (test) {
        test.test('integer', function (test) {
            let template = '{{ 922337203685477580700 }}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NUMBER), '922337203685477580700', 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 25);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 26);
            testToken(test, stream.getCurrent(), null, 1, 28, TwingTokenType.EOF);

            test.end();
        });

        test.test('float', function (test) {
            let template = '{{ 92233720368547.7580700 }}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.NUMBER), '92233720368547.7580700', 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 26);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 27);
            testToken(test, stream.getCurrent(), null, 1, 29, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('testStringWithEscapedDelimiter', function (test) {
        let fixtures = [
            {template: "{{ 'foo \\' bar' }}", name: "foo \\' bar", expected: "foo \\' bar", quote: '\''},
            {template: '{{ "foo \\" bar" }}', name: 'foo \\" bar', expected: 'foo \\" bar', quote: '"'}
        ];

        fixtures.forEach(function (fixture) {
            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(fixture.template, 'index'));

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), fixture.quote, 1, 4);
            testToken(test, stream.expect(TwingTokenType.STRING), fixture.expected, 1, 5);
            testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), fixture.quote, 1, 15);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 16);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 17);
            testToken(test, stream.getCurrent(), null, 1, 19, TwingTokenType.EOF);
        });

        test.end();
    });

    test.test('testStringWithInterpolation', function (test) {
        let template = 'foo {{ "bar #{ baz + 1 }" }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.TEXT), 'foo ', 1, 1);
        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 5);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 7);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 8);
        testToken(test, stream.expect(TwingTokenType.STRING), 'bar ', 1, 9);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_START), '#{', 1, 13);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 15);
        testToken(test, stream.expect(TwingTokenType.NAME), 'baz', 1, 16);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 19);
        testToken(test, stream.expect(TwingTokenType.OPERATOR), '+', 1, 20);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 21);
        testToken(test, stream.expect(TwingTokenType.NUMBER), '1', 1, 22);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 23);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_END), '}', 1, 24);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 25);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 26);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 27);
        testToken(test, stream.getCurrent(), null, 1, 29, TwingTokenType.EOF);

        test.end();
    });

    test.test('testStringWithEscapedInterpolation', function (test) {
        let template = '{{ "bar \\#{baz+1}" }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 4);
        testToken(test, stream.expect(TwingTokenType.STRING), 'bar \\#{baz+1}', 1, 5);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 18);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 19);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 20);
        testToken(test, stream.getCurrent(), null, 1, 22, TwingTokenType.EOF);

        test.end();
    });

    test.test('testStringWithHash', function (test) {
        let template = '{{ "bar # baz" }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 4);
        testToken(test, stream.expect(TwingTokenType.STRING), 'bar # baz', 1, 5);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 14);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 15);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 16);
        testToken(test, stream.getCurrent(), null, 1, 18, TwingTokenType.EOF);

        test.test('AST', function (test) {
            stream.rewind();
            stream = stream.toAst();

            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
            testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 4);
            testToken(test, stream.expect(TwingTokenType.STRING), 'bar # baz', 1, 5);
            testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 14);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 16);
            testToken(test, stream.getCurrent(), null, 1, 18, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('testStringWithUnterminatedInterpolation', function (test) {
        let template = '{{ "bar #{x" }}';

        let lexer = createLexer();

        test.throws(function () {
            lexer.tokenize(new TwingSource(template, 'index'));
        });

        test.end();
    });

    test.test('testStringWithNestedInterpolations', function (test) {
        let template = '{{ "bar #{ "foo#{bar}" }" }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 4);
        testToken(test, stream.expect(TwingTokenType.STRING), 'bar ', 1, 5);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_START), '#{', 1, 9);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 11);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 12);
        testToken(test, stream.expect(TwingTokenType.STRING), 'foo', 1, 13);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_START), '#{', 1, 16);
        testToken(test, stream.expect(TwingTokenType.NAME), 'bar', 1, 18);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_END), '}', 1, 21);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 22);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 23);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_END), '}', 1, 24);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 25);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 26);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 27);
        testToken(test, stream.getCurrent(), null, 1, 29, TwingTokenType.EOF);

        test.end();
    });

    test.test('testStringWithNestedInterpolationsInBlock', function (test) {
        let template = '{% foo "bar #{ "foo#{bar}" }" %}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.NAME), 'foo', 1, 4);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 7);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 8);
        testToken(test, stream.expect(TwingTokenType.STRING), 'bar ', 1, 9);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_START), '#{', 1, 13);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 15);
        testToken(test, stream.expect(TwingTokenType.OPENING_QUOTE), '"', 1, 16);
        testToken(test, stream.expect(TwingTokenType.STRING), 'foo', 1, 17);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_START), '#{', 1, 20);
        testToken(test, stream.expect(TwingTokenType.NAME), 'bar', 1, 22);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_END), '}', 1, 25);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 26);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 27);
        testToken(test, stream.expect(TwingTokenType.INTERPOLATION_END), '}', 1, 28);
        testToken(test, stream.expect(TwingTokenType.CLOSING_QUOTE), '"', 1, 29);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 30);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 31);
        testToken(test, stream.getCurrent(), null, 1, 33, TwingTokenType.EOF);

        test.end();
    });

    test.test('testOperatorEndingWithALetterAtTheEndOfALine', function (test) {
        let template = '{{ 1 and\n0}}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.NUMBER), '1', 1, 4);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 5);
        testToken(test, stream.expect(TwingTokenType.OPERATOR), 'and', 1, 6);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), '\n', 1, 9);
        testToken(test, stream.expect(TwingTokenType.NUMBER), '0', 2, 1);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 2, 2);
        testToken(test, stream.getCurrent(), null, 2, 4, TwingTokenType.EOF);

        test.end();
    });

    test.test('whitespace trimming', function (test) {
        let template = '{%- foo -%}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING), '-', 1, 3);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 4);
        testToken(test, stream.expect(TwingTokenType.NAME), 'foo', 1, 5);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 8);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING), '-', 1, 9);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 10);
        testToken(test, stream.getCurrent(), null, 1, 12, TwingTokenType.EOF);

        test.end();
    });

    test.test('testUnterminatedVariable', function (test) {
        let template = '{{ bar ';

        let lexer = createLexer();
        let source = new TwingSource(template, 'index');

        test.throws(function () {
            lexer.tokenize(source);
        }, new TwingErrorSyntax('Unclosed "variable".', 1, source));

        test.end();
    });

    test.test('testUnterminatedBlock', function (test) {
        let template = '{% bar ';

        let lexer = createLexer();
        let source = new TwingSource(template, 'index');

        test.throws(function () {
            lexer.tokenize(source);
        }, new TwingErrorSyntax('Unclosed "block".', 1, source));

        test.end();
    });

    test.test('new lines', function (test) {
        let template = '\r\rfoo\r\nbar\roof\n\r';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        test.test('cst lets new lines untouched', function (test) {
            testToken(test, stream.expect(TwingTokenType.TEXT), '\r\rfoo\r\nbar\roof\n\r', 1, 1);
            testToken(test, stream.getCurrent(), null, 7, 1, TwingTokenType.EOF);

            test.end();
        });

        test.test('ast normalizes new lines', function (test) {
            stream.rewind();
            stream = stream.toAst();

            testToken(test, stream.expect(TwingTokenType.TEXT), '\n\nfoo\nbar\noof\n\n', 1, 1);
            testToken(test, stream.getCurrent(), null, 7, 1, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('lexExpression', function (test) {
        test.test('punctuation', function (test) {
            let template = '{{ foo) }}';

            let lexer = createLexer();
            let source = new TwingSource(template, 'index');

            test.throws(function () {
                lexer.tokenize(source);
            }, new TwingErrorSyntax('Unexpected ")".', 1, source));


            template = '{{ foo( }}';
            source = new TwingSource(template, 'index');

            test.throws(function () {
                lexer.tokenize(source);
            }, new TwingErrorSyntax('Unclosed ")".', 1, source));

            test.end();
        });

        test.test('unlexable', function (test) {
            let template = '{{ ^ }}';

            let lexer = createLexer();
            let source = new TwingSource(template, 'index');

            test.throws(function () {
                lexer.tokenize(source);
            }, new TwingErrorSyntax('Unexpected character "^ }}" in "{{ ^ }}".', 1, source));

            test.end();
        });

        test.end();
    });

    test.test('lexRawData', function (test) {
        test.test('unclosed verbatim', function (test) {
            let template = '{% verbatim %}';

            let lexer = createLexer();
            let source = new TwingSource(template, 'index');

            test.throws(function () {
                lexer.tokenize(source);
            }, new TwingErrorSyntax('Unexpected end of file: Unclosed "verbatim" block.', 1, source));

            test.end();
        });

        test.end();
    });

    test.test('lexComment', function (test) {
        let template = '{# foo bar #}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.TEXT), 'foo bar', 1, 4);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 11);
        testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}', 1, 12);
        testToken(test, stream.getCurrent(), null, 1, 14, TwingTokenType.EOF);

        test.test('long comments', function (test) {
            let value = '*'.repeat(100000);
            let template = '{#' + value + '#}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 1, 1);
            testToken(test, stream.expect(TwingTokenType.TEXT), value, 1, 3);
            testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}', 1, 100003);
            testToken(test, stream.getCurrent(), null, 1, 100005, TwingTokenType.EOF);

            test.end();
        });

        test.test('unclosed comment', function (test) {
            let template = '{#';

            let lexer = createLexer();
            let source = new TwingSource(template, 'index');

            test.throws(function () {
                lexer.tokenize(source);
            }, new TwingErrorSyntax('Unclosed comment.', 1, source));

            test.end();
        });

        test.test('comment end consumes next line separator', function (test) {
            let template = '{#rn#}\r\n{#r#}\r{#n#}\n';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 1, 1);
            testToken(test, stream.expect(TwingTokenType.TEXT), 'rn', 1, 3);
            testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}\r\n', 1, 5);
            testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 2, 1);
            testToken(test, stream.expect(TwingTokenType.TEXT), 'r', 2, 3);
            testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}\r', 2, 4);
            testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 3, 1);
            testToken(test, stream.expect(TwingTokenType.TEXT), 'n', 3, 3);
            testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}\n', 3, 4);
            testToken(test, stream.getCurrent(), null, 4, 1, TwingTokenType.EOF);

            test.end();
        });

        test.test('comment followed by a non-comment', function (test) {
            let template = '{# a #}{{foo}}';

            let lexer = createLexer();
            let stream = lexer.tokenize(new TwingSource(template, 'index'));

            testToken(test, stream.expect(TwingTokenType.COMMENT_START), '{#', 1, 1);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
            testToken(test, stream.expect(TwingTokenType.TEXT), 'a', 1, 4);
            testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 5);
            testToken(test, stream.expect(TwingTokenType.COMMENT_END), '#}', 1, 6);
            testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 8);
            testToken(test, stream.expect(TwingTokenType.NAME), 'foo', 1, 10);
            testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 13);
            testToken(test, stream.getCurrent(), null, 1, 15, TwingTokenType.EOF);

            test.end();
        });

        test.end();
    });

    test.test('block end consumes next line separator', function (test) {
        let template = '{%rn%}\r\n{%r%}\r{%n%}\n';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
        testToken(test, stream.expect(TwingTokenType.NAME), 'rn', 1, 3);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}\r\n', 1, 5);
        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 2, 1);
        testToken(test, stream.expect(TwingTokenType.NAME), 'r', 2, 3);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}\r', 2, 4);
        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 3, 1);
        testToken(test, stream.expect(TwingTokenType.NAME), 'n', 3, 3);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}\n', 3, 4);
        testToken(test, stream.getCurrent(), null, 4, 1, TwingTokenType.EOF);

        test.end();
    });

    test.test('punctuation', function(test) {
        let template = '{{ [1, 2] }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.VAR_START), '{{', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '[', 1, 4);
        testToken(test, stream.expect(TwingTokenType.NUMBER), '1', 1, 5);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ',', 1, 6);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 7);
        testToken(test, stream.expect(TwingTokenType.NUMBER), '2', 1, 8);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ']', 1, 9);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 10);
        testToken(test, stream.expect(TwingTokenType.VAR_END), '}}', 1, 11);
        testToken(test, stream.getCurrent(), null, 1, 13, TwingTokenType.EOF);

        test.end();
    });

    test.test('macro', function(test) {
        let template = '{% macro a() %}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        testToken(test, stream.expect(TwingTokenType.BLOCK_START), '{%', 1, 1);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 3);
        testToken(test, stream.expect(TwingTokenType.NAME), 'macro', 1, 4);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 9);
        testToken(test, stream.expect(TwingTokenType.NAME), 'a', 1, 10);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), '(', 1, 11);
        testToken(test, stream.expect(TwingTokenType.PUNCTUATION), ')', 1, 12);
        testToken(test, stream.expect(TwingTokenType.WHITESPACE), ' ', 1, 13);
        testToken(test, stream.expect(TwingTokenType.BLOCK_END), '%}', 1, 14);
        testToken(test, stream.getCurrent(), null, 1, 16, TwingTokenType.EOF);

        test.end();
    });

    test.test('CST is lossless', function(test) {
        let template = `{{ [1, 2] }}
        {% embed __foo    %}
{% include("foo.twig") %}
  {{foo -}}

{{ a_function ( "a": 5)     
}}
{% verbatim %}
{{ foo }}
{% bar %}{% endbar %}
{% endverbatim %}
{%endembed%}
        
        `;

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        let actual = stream.serialize();

        test.same(actual, template);

        test.end();
    });

    test.end();
});
