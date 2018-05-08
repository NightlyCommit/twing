const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingLexer = require('../../../../lib/twing/lexer').TwingLexer;
const TwingToken = require('../../../../lib/twing/token').TwingToken;
const TwingSource = require('../../../../lib/twing/source').TwingSource;
const TwingErrorSyntax = require('../../../../lib/twing/error/syntax').TwingErrorSyntax;

const tap = require('tap');

let createLexer = function () {
    return new TwingLexer(new TwingEnvironment(null));
};

let countToken = function (template, type, value = null) {
    let lexer = createLexer();
    let stream = lexer.tokenize(new TwingSource(template, 'index'));
    let count = 0;

    while (!stream.isEOF()) {
        let token = stream.next();

        if (type === token.getType()) {
            if (null === value || value === token.getValue()) {
                ++count;
            }
        }
    }

    return count;
};

let testToken = (test, token, value, line, column, type = null) => {
    test.same(token.getValue(), value, 'value should be "' + value + '"');
    test.same(token.getLine(), line, 'line should be ' + line);
    test.same(token.getColumn(), column, 'column should be ' + column);

    if (type) {
        test.same(token.getType(), type, 'type should be "' + TwingToken.typeToEnglish(type) + '"');
    }
};

tap.test('lexer', function (test) {
    test.test('testNameLabelForTag', function (test) {
        let data = '{% § %}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        test.test('"{%"', function (test) {
            testToken(test, stream.expect(TwingToken.BLOCK_START_TYPE), null, 1, 0);

            test.end();
        });

        test.test('"§"', function (test) {
            testToken(test, stream.expect(TwingToken.NAME_TYPE), '§', 1, 3);

            test.end();
        });

        test.test('" %}"', function (test) {
            testToken(test, stream.expect(TwingToken.BLOCK_END_TYPE), null, 1, 4);

            test.end();
        });

        test.test('EOF', function (test) {
            testToken(test, stream.getCurrent(), null, 1, 7, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });

    test.test('testNameLabelForFunction', function (test) {
        let data = '{{ §() }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        test.test('"{{"', function (test) {
            testToken(test, stream.expect(TwingToken.VAR_START_TYPE), null, 1, 0);

            test.end();
        });

        test.test('"§"', function (test) {
            testToken(test, stream.expect(TwingToken.NAME_TYPE), '§', 1, 3);

            test.end();
        });

        test.test('"("', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), '(', 1, 4);

            test.end();
        });

        test.test('")"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), ')', 1, 5);

            test.end();
        });

        test.test('" }}"', function (test) {
            testToken(test, stream.expect(TwingToken.VAR_END_TYPE), null, 1, 6);

            test.end();
        });

        test.test('EOF', function (test) {
            testToken(test, stream.getCurrent(), null, 1, 9, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });

    test.test('testBracketsNesting', function (test) {
        let data = '{{ {"a":{"b":"c"}} }}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        test.test('"{{"', function (test) {
            testToken(test, stream.expect(TwingToken.VAR_START_TYPE), null, 1, 0);

            test.end();
        });

        test.test('"{"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), '{', 1, 3);

            test.end();
        });

        test.test('""a""', function (test) {
            testToken(test, stream.expect(TwingToken.STRING_TYPE), 'a', 1, 4);

            test.end();
        });

        test.test('":"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), ':', 1, 7);

            test.end();
        });

        test.test('"{"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), '{', 1, 8);

            test.end();
        });

        test.test('""b""', function (test) {
            testToken(test, stream.expect(TwingToken.STRING_TYPE), 'b', 1, 9);

            test.end();
        });

        test.test('":"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), ':', 1, 12);

            test.end();
        });

        test.test('""c""', function (test) {
            testToken(test, stream.expect(TwingToken.STRING_TYPE), 'c', 1, 13);

            test.end();
        });

        test.test('"}"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), '}', 1, 16);

            test.end();
        });

        test.test('"}"', function (test) {
            testToken(test, stream.expect(TwingToken.PUNCTUATION_TYPE), '}', 1, 17);

            test.end();
        });

        test.test('" }}"', function (test) {
            testToken(test, stream.expect(TwingToken.VAR_END_TYPE), null, 1, 18);

            test.end();
        });

        test.test('EOF', function (test) {
            testToken(test, stream.getCurrent(), null, 1, 21, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });

    test.test('testLineDirective', function (test) {
        let data = `foo
bar
{% line 10 %}
{{
baz
}}
`;

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        test.test('"foo\\nbar\\n{%"', function(test) {
            testToken(test, stream.expect(TwingToken.TEXT_TYPE), 'foo\nbar\n', 1, 0);

            test.end();
        });

        test.test('"\\n" after "line 10 %}"', function(test) {
            testToken(test, stream.expect(TwingToken.TEXT_TYPE), '\n', 10, 13);

            test.end();
        });

        test.test('"{{"', function(test) {
            testToken(test, stream.expect(TwingToken.VAR_START_TYPE), null, 11, 0);

            test.end();
        });

        test.test('"baz"', function(test) {
            testToken(test, stream.expect(TwingToken.NAME_TYPE), 'baz', 12, 0);

            test.end();
        });

        test.test('"}}"', function(test) {
            testToken(test, stream.expect(TwingToken.VAR_END_TYPE), null, 13, 0);

            test.end();
        });

        test.test('"\\n"', function(test) {
            testToken(test, stream.expect(TwingToken.TEXT_TYPE), '\n', 13, 2);

            test.end();
        });

        test.test('EOF', function(test) {
            testToken(test, stream.getCurrent(), null, 14, 0, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });

    test.test('testLineDirectiveInline', function (test) {
        let template = `foo
bar{% line 10 %}{{
baz
}}
`;

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        test.test('"foo\\nbar{%"', function(test) {
            testToken(test, stream.expect(TwingToken.TEXT_TYPE), 'foo\nbar', 1, 0);

            test.end();
        });

        test.test('"{{" after "line 10 %}"', function(test) {
            testToken(test, stream.expect(TwingToken.VAR_START_TYPE), null, 10, 13);

            test.end();
        });

        test.test('"baz"', function(test) {
            testToken(test, stream.expect(TwingToken.NAME_TYPE), 'baz', 11, 0);

            test.end();
        });

        test.test('"}}"', function(test) {
            testToken(test, stream.expect(TwingToken.VAR_END_TYPE), null, 12, 0);

            test.end();
        });

        test.test('"\\n"', function(test) {
            testToken(test, stream.expect(TwingToken.TEXT_TYPE), '\n', 12, 2);

            test.end();
        });

        test.test('EOF', function(test) {
            testToken(test, stream.getCurrent(), null, 13, 0, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });

    test.test('testLongComments', function (test) {
        let template = '{#' + '*'.repeat(100000) + '#}';

        let lexer = createLexer();
        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        test.test('EOF', function(test) {
            testToken(test, stream.getCurrent(), null, 1, 100004, TwingToken.EOF_TYPE);

            test.end();
        });

        test.end();
    });
    //
    // test.test('testLongVerbatim', function (test) {
    //     let template = '{% verbatim %}' + '*'.repeat(100000) + '{% endverbatim %}';
    //     let lexer = createLexer();
    //
    //     lexer.tokenize(new TwingSource(template, 'index'));
    //
    //     // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
    //     // can be executed without throwing any exceptions
    //     test.pass('should not throw an exception');
    //
    //     test.end();
    // });
    //
    // test.test('testLongVar', function (test) {
    //     let template = '{{ ' + 'x'.repeat(100000) + ' }}';
    //     let lexer = createLexer();
    //
    //     lexer.tokenize(new TwingSource(template, 'index'));
    //
    //     // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
    //     // can be executed without throwing any exceptions
    //     test.pass('should not throw an exception');
    //
    //     test.end();
    // });
    //
    // test.test('testLongBlock', function (test) {
    //     let template = '{% ' + 'x'.repeat(100000) + ' %}';
    //     let lexer = createLexer();
    //
    //     lexer.tokenize(new TwingSource(template, 'index'));
    //
    //     // add a dummy assertion here to satisfy the test, the only thing we want to test is that the code above
    //     // can be executed without throwing any exceptions
    //     test.pass('should not throw an exception');
    //
    //     test.end();
    // });
    //
    // test.test('testBigNumbers', function (test) {
    //     let template = '{{ 922337203685477580700 }}';
    //     let lexer = createLexer();
    //
    //     let stream = lexer.tokenize(new TwingSource(template, 'index'));
    //
    //     stream.next();
    //
    //     let token = stream.next();
    //
    //     test.equal(token.getValue(), 922337203685477580700);
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithEscapedDelimiter', function (test) {
    //     let fixtures = [
    //         {template: "{{ 'foo \\' bar' }}", expected: 'foo \' bar'},
    //         {template: '{{ "foo \\" bar" }}', expected: 'foo " bar'}
    //     ];
    //
    //     let lexer = createLexer();
    //
    //     fixtures.forEach(function (fixture) {
    //         test.doesNotThrow(function () {
    //             let stream = lexer.tokenize(new TwingSource(fixture.template, 'index'));
    //
    //             stream.expect(TwingToken.VAR_START_TYPE);
    //             stream.expect(TwingToken.STRING_TYPE, fixture.expected);
    //         });
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithInterpolation', function (test) {
    //     let lexer = createLexer();
    //     let data = 'foo {{ "bar #{ baz + 1 }" }}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.TEXT_TYPE, 'foo ');
    //         stream.expect(TwingToken.VAR_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'bar ');
    //         stream.expect(TwingToken.INTERPOLATION_START_TYPE);
    //         stream.expect(TwingToken.NAME_TYPE, 'baz');
    //         stream.expect(TwingToken.OPERATOR_TYPE, '+');
    //         stream.expect(TwingToken.NUMBER_TYPE, '1');
    //         stream.expect(TwingToken.INTERPOLATION_END_TYPE);
    //         stream.expect(TwingToken.VAR_END_TYPE);
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithEscapedInterpolation', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ "bar \\#{baz+1}" }}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.VAR_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'bar #{baz+1}');
    //         stream.expect(TwingToken.VAR_END_TYPE);
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithHash', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ "bar # baz" }}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.VAR_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'bar # baz');
    //         stream.expect(TwingToken.VAR_END_TYPE);
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithUnterminatedInterpolation', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ "bar #{x" }}';
    //
    //     test.throws(function () {
    //         lexer.tokenize(new TwingSource(data, 'index'));
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithNestedInterpolations', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ "bar #{ "foo#{bar}" }" }}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.VAR_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'bar ');
    //         stream.expect(TwingToken.INTERPOLATION_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'foo');
    //         stream.expect(TwingToken.INTERPOLATION_START_TYPE);
    //         stream.expect(TwingToken.NAME_TYPE, 'bar');
    //         stream.expect(TwingToken.INTERPOLATION_END_TYPE);
    //         stream.expect(TwingToken.INTERPOLATION_END_TYPE);
    //         stream.expect(TwingToken.VAR_END_TYPE);
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testStringWithNestedInterpolationsInBlock', function (test) {
    //     let lexer = createLexer();
    //     let data = '{% foo "bar #{ "foo#{bar}" }" %}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.BLOCK_START_TYPE);
    //         stream.expect(TwingToken.NAME_TYPE, 'foo');
    //         stream.expect(TwingToken.STRING_TYPE, 'bar ');
    //         stream.expect(TwingToken.INTERPOLATION_START_TYPE);
    //         stream.expect(TwingToken.STRING_TYPE, 'foo');
    //         stream.expect(TwingToken.INTERPOLATION_START_TYPE);
    //         stream.expect(TwingToken.NAME_TYPE, 'bar');
    //         stream.expect(TwingToken.INTERPOLATION_END_TYPE);
    //         stream.expect(TwingToken.INTERPOLATION_END_TYPE);
    //         stream.expect(TwingToken.BLOCK_END_TYPE);
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testOperatorEndingWithALetterAtTheEndOfALine', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ 1 and\n0}}';
    //
    //     test.doesNotThrow(function () {
    //         let stream = lexer.tokenize(new TwingSource(data, 'index'));
    //
    //         stream.expect(TwingToken.VAR_START_TYPE);
    //         stream.expect(TwingToken.NUMBER_TYPE, 1);
    //         stream.expect(TwingToken.OPERATOR_TYPE, 'and');
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('testUnterminatedVariable', function (test) {
    //     let lexer = createLexer();
    //     let data = '{{ bar ';
    //     let source = new TwingSource(data, 'index');
    //
    //     test.throws(function () {
    //         lexer.tokenize(source);
    //     }, new TwingErrorSyntax('Unclosed "variable".', 1, source));
    //
    //     test.end();
    // });
    //
    // test.test('testUnterminatedBlock', function (test) {
    //     let lexer = createLexer();
    //     let data = '{% bar ';
    //     let source = new TwingSource(data, 'index');
    //
    //     test.throws(function () {
    //         lexer.tokenize(source);
    //     }, new TwingErrorSyntax('Unclosed "block".', 1, source));
    //
    //     test.end();
    // });
    //
    // test.test('should normalize new lines', function (test) {
    //     let lexer = createLexer();
    //     let data = '\r\rfoo\r\nbar\roof\n\r';
    //
    //     let token = lexer.tokenize(new TwingSource(data, 'index')).next();
    //
    //     test.same(token.value, '\n\nfoo\nbar\noof\n\n');
    //
    //     test.end();
    // });
    //
    // test.test('lexExpression', function (test) {
    //     test.test('punctuation', function (test) {
    //         let lexer = createLexer();
    //         let data = '{{ foo) }}';
    //         let source = new TwingSource(data, 'index');
    //
    //         test.throws(function () {
    //             lexer.tokenize(source);
    //         }, new TwingErrorSyntax('Unexpected ")".', 1, source));
    //
    //
    //         data = '{{ foo( }}';
    //         source = new TwingSource(data, 'index');
    //
    //         test.throws(function () {
    //             lexer.tokenize(source);
    //         }, new TwingErrorSyntax('Unclosed ")".', 1, source));
    //
    //         test.end();
    //     });
    //
    //     test.test('unlexable', function (test) {
    //         let lexer = createLexer();
    //         let data = '{{ ^ }}';
    //         let source = new TwingSource(data, 'index');
    //
    //         test.throws(function () {
    //             lexer.tokenize(source);
    //         }, new TwingErrorSyntax('Unexpected character "^ }}" in "{{ ^ }}".', 1, source));
    //
    //         test.end();
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('lexRawData', function (test) {
    //     test.test('unclosed verbatim', function (test) {
    //         let lexer = createLexer();
    //         let data = '{% verbatim %}';
    //         let source = new TwingSource(data, 'index');
    //
    //         test.throws(function () {
    //             lexer.tokenize(source);
    //         }, new TwingErrorSyntax('Unexpected end of file: Unclosed "verbatim" block.', 1, source));
    //
    //         test.end();
    //     });
    //
    //     test.end();
    // });
    //
    // test.test('lexComment', function (test) {
    //     test.test('unclosed comment', function (test) {
    //         let lexer = createLexer();
    //         let data = '{#';
    //         let source = new TwingSource(data, 'index');
    //
    //         test.throws(function () {
    //             lexer.tokenize(source);
    //         }, new TwingErrorSyntax('Unclosed comment.', 1, source));
    //
    //         test.end();
    //     });
    //
    //     test.end();
    // });

    test.end();
});
