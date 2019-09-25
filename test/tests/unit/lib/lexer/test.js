const {
    TwingEnvironment,
    TwingLexer,
    TwingToken,
    TwingSource,
    TwingErrorSyntax,
    TwingLoaderNull
} = require('../../../../../build/main');

const {typeToEnglish} = require('../../../../../build/lib/lexer');
const tap = require('tape');
const {TokenType} = require('twig-lexer');

let createLexer = function () {
    return new TwingLexer(new TwingEnvironment(null));
};

let testToken = (test, token, value, line, column, type = null) => {
    test.looseEqual(token.getValue(), value, 'value should be "' + ((value && value.length > 80) ? value.substr(0, 77) + '...' : value) + '"');
    test.same(token.getLine(), line, 'line should be ' + line);
    test.same(token.getColumn(), column, 'column should be ' + column);

    if (type) {
        test.same(token.getType(), type, 'type should be "' + typeToEnglish(type) + '"');
    }
};

tap.test('lexer', function (test) {
    test.test('constructor', function (test) {
        test.test('support passing variable_pair option', function(test) {
            let lexer = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), {
                variable_pair: ['<<', '>>']
            });

            let data = '<<foo>>';

            let tokens = lexer.tokenize(data);

            test.true(tokens[0].test(TokenType.VARIABLE_START, '<<'));
            test.true(tokens[1].test(TokenType.NAME, 'foo'));
            test.true(tokens[2].test(TokenType.VARIABLE_END, '>>'));

            test.end();
        });

        test.test('support passing comment_pair option', function(test) {
            let lexer = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), {
                comment_pair: ['<<', '>>']
            });

            let data = '<<foo>>';

            let tokens = lexer.tokenize(data);

            test.true(tokens[0].test(TokenType.COMMENT_START, '<<'));
            test.true(tokens[1].test(TokenType.TEXT, 'foo'));
            test.true(tokens[2].test(TokenType.COMMENT_END, '>>'));

            test.end();
        });

        test.test('support passing interpolation_pair option', function(test) {
            let lexer = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), {
                interpolation_pair: ['#<', '>']
            });

            let data = '{{"#<foo>>"}}';

            let tokens = lexer.tokenize(data);

            test.true(tokens[2].test(TokenType.INTERPOLATION_START, '#<'));
            test.true(tokens[3].test(TokenType.NAME, 'foo'));
            test.true(tokens[4].test(TokenType.INTERPOLATION_END, '>'));

            test.end();
        });

        test.test('support passing tag_pair option', function(test) {
            let lexer = new TwingLexer(new TwingEnvironment(new TwingLoaderNull()), {
                tag_pair: ['<<', '>>']
            });

            let data = '<<foo>>';

            let tokens = lexer.tokenize(data);

            test.true(tokens[0].test(TokenType.TAG_START, '<<'));
            test.true(tokens[1].test(TokenType.NAME, 'foo'));
            test.true(tokens[2].test(TokenType.TAG_END, '>>'));

            test.end();
        });

        test.end();
    });

    test.test('should support type to english representation', function (test) {
        test.same(typeToEnglish(TokenType.TAG_END), 'end of statement block');
        test.same(typeToEnglish(TokenType.TAG_START), 'begin of statement block');
        test.same(typeToEnglish(TokenType.EOF), 'end of template');
        test.same(typeToEnglish(TokenType.INTERPOLATION_END), 'end of string interpolation');
        test.same(typeToEnglish(TokenType.INTERPOLATION_START), 'begin of string interpolation');
        test.same(typeToEnglish(TokenType.NAME), 'name');
        test.same(typeToEnglish(TokenType.NUMBER), 'number');
        test.same(typeToEnglish(TokenType.OPERATOR), 'operator');
        test.same(typeToEnglish(TokenType.PUNCTUATION), 'punctuation');
        test.same(typeToEnglish(TokenType.STRING), 'string');
        test.same(typeToEnglish(TokenType.TEXT), 'text');
        test.same(typeToEnglish(TokenType.VARIABLE_END), 'end of print statement');
        test.same(typeToEnglish(TokenType.VARIABLE_START), 'begin of print statement');
        test.same(typeToEnglish(TokenType.COMMENT_START), 'begin of comment statement');
        test.same(typeToEnglish(TokenType.COMMENT_END), 'end of comment statement');
        test.same(typeToEnglish(TokenType.ARROW), 'arrow function');

        try {
            typeToEnglish(-999);
        }
        catch (e) {
            test.same(e.message, 'Token of type "-999" does not exist.');
        }

        test.end();
    });

//     test.test('testNameLabelForTag', function (test) {
//         let data = '{% § %}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(data, 'index'));
//
//         test.test('"{%"', function (test) {
//             testToken(test, stream.expect(TokenType.TAG_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"§"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), '§', 1, 4);
//
//             test.end();
//         });
//
//         test.test('" %}"', function (test) {
//             testToken(test, stream.expect(TokenType.TAG_END), null, 1, 5);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 8, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testNameLabelForFunction', function (test) {
//         let data = '{{ §() }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(data, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"§"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), '§', 1, 4);
//
//             test.end();
//         });
//
//         test.test('"("', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), '(', 1, 5);
//
//             test.end();
//         });
//
//         test.test('")"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), ')', 1, 6);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 7);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 10, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testBracketsNesting', function (test) {
//         let data = '{{ {"a":{"b":"c"}} }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(data, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"{"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), '{', 1, 4);
//
//             test.end();
//         });
//
//         test.test('""a""', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'a', 1, 5);
//
//             test.end();
//         });
//
//         test.test('":"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), ':', 1, 8);
//
//             test.end();
//         });
//
//         test.test('"{"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), '{', 1, 9);
//
//             test.end();
//         });
//
//         test.test('""b""', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'b', 1, 10);
//
//             test.end();
//         });
//
//         test.test('":"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), ':', 1, 13);
//
//             test.end();
//         });
//
//         test.test('""c""', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'c', 1, 14);
//
//             test.end();
//         });
//
//         test.test('"}"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), '}', 1, 17);
//
//             test.end();
//         });
//
//         test.test('"}"', function (test) {
//             testToken(test, stream.expect(TokenType.PUNCTUATION), '}', 1, 18);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 19);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 22, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testLineDirective', function (test) {
//         let data = `foo
// bar
// {% line 10 %}
// {{
// baz
// }}
// `;
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(data, 'index'));
//
//         test.test('"foo\\nbar\\n{%"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), 'foo\nbar\n', 1, 1);
//
//             test.end();
//         });
//
//         test.test('"\\n" after "line 10 %}"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), '\n', 10, 14);
//
//             test.end();
//         });
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 11, 1);
//
//             test.end();
//         });
//
//         test.test('"baz"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'baz', 12, 1);
//
//             test.end();
//         });
//
//         test.test('"}}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 13, 1);
//
//             test.end();
//         });
//
//         test.test('"\\n"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), '\n', 13, 3);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 14, 1, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testLineDirectiveInline', function (test) {
//         let template = `foo
// bar{% line 10 %}{{
// baz
// }}
// `;
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"foo\\nbar{%"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), 'foo\nbar', 1, 1);
//
//             test.end();
//         });
//
//         test.test('"{{" after "line 10 %}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 10, 17);
//
//             test.end();
//         });
//
//         test.test('"baz"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'baz', 11, 1);
//
//             test.end();
//         });
//
//         test.test('"}}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 12, 1);
//
//             test.end();
//         });
//
//         test.test('"\\n"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), '\n', 12, 3);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 13, 1, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('verbatim', function (test) {
//         test.test('multiple lines', function (test) {
//             let template = `{% verbatim %}
//     {{ 'bla' }}
// {% endverbatim %}`;
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"\\n    {{ \'bla\' }}\\n"', function (test) {
//                 testToken(test, stream.expect(TokenType.TEXT), '\n    {{ \'bla\' }}\n', 1, 15);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 3, 18, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.test('long', function (test) {
//             let template = '{% verbatim %}' + '*'.repeat(100000) + '{% endverbatim %}';
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"*"', function (test) {
//                 testToken(test, stream.expect(TokenType.TEXT), '*'.repeat(100000), 1, 15);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 1, 100032, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('var', function (test) {
//         test.test('multiple lines', function (test) {
//             let template = `{{
// bla
// }}`;
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"{{\\n"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//                 test.end();
//             });
//
//             test.test('"bla\\n"', function (test) {
//                 testToken(test, stream.expect(TokenType.NAME), 'bla', 2, 1);
//
//                 test.end();
//             });
//
//             test.test('"}}"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_END), null, 3, 1);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 3, 3, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.test('long', function (test) {
//             let template = '{{ ' + 'x'.repeat(100000) + ' }}';
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"{{"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//                 test.end();
//             });
//
//             test.test('"x"', function (test) {
//                 testToken(test, stream.expect(TokenType.NAME), 'x'.repeat(100000), 1, 4);
//
//                 test.end();
//             });
//
//             test.test('" }}"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_END), null, 1, 100004);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 1, 100007, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('block', function (test) {
//         test.test('multiple lines', function (test) {
//             let template = `{%
// bla
// %}`;
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"{%\\n"', function (test) {
//                 testToken(test, stream.expect(TokenType.TAG_START), null, 1, 1);
//
//                 test.end();
//             });
//
//             test.test('"bla"', function (test) {
//                 testToken(test, stream.expect(TokenType.NAME), 'bla', 2, 1);
//
//                 test.end();
//             });
//
//             test.test('"\\n%}"', function (test) {
//                 testToken(test, stream.expect(TokenType.TAG_END), null, 2, 4);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 3, 3, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.test('long', function (test) {
//             let template = '{% ' + 'x'.repeat(100000) + ' %}';
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             test.test('"{%"', function (test) {
//                 testToken(test, stream.expect(TokenType.TAG_START), null, 1, 1);
//
//                 test.end();
//             });
//
//             test.test('"x"', function (test) {
//                 testToken(test, stream.expect(TokenType.NAME), 'x'.repeat(100000), 1, 4);
//
//                 test.end();
//             });
//
//             test.test('" %}"', function (test) {
//                 testToken(test, stream.expect(TokenType.TAG_END), null, 1, 100004);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 1, 100007, TokenType.EOF);
//
//                 test.end();
//             });
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testBigNumbers', function (test) {
//         let template = '{{ 922337203685477580700 }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"922337203685477580700"', function (test) {
//             testToken(test, stream.expect(TokenType.NUMBER), '922337203685477580700', 1, 4);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 25);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 28, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithEscapedDelimiter', function (test) {
//         let fixtures = [
//             {template: "{{ 'foo \\' bar' }}", name: "foo \\' bar", expected: "foo ' bar"},
//             {template: '{{ "foo \\" bar" }}', name: 'foo \\" bar', expected: 'foo " bar'}
//         ];
//
//         fixtures.forEach(function (fixture, index) {
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(fixture.template, 'index'));
//
//             test.test('"{{"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//                 test.end();
//             });
//
//             test.test(`"${fixture.name}"`, function (test) {
//                 testToken(test, stream.expect(TokenType.STRING), fixture.expected, 1, 4);
//
//                 test.end();
//             });
//
//             test.test('" }}"', function (test) {
//                 testToken(test, stream.expect(TokenType.VAR_END), null, 1, 16);
//
//                 test.end();
//             });
//
//             test.test('EOF', function (test) {
//                 testToken(test, stream.getCurrent(), null, 1, 19, TokenType.EOF);
//
//                 test.end();
//             });
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithInterpolation', function (test) {
//         let template = 'foo {{ "bar #{ baz + 1 }" }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"foo "', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), 'foo ', 1, 1);
//
//             test.end();
//         });
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 5);
//
//             test.end();
//         });
//
//         test.test('""bar"', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'bar ', 1, 9);
//
//             test.end();
//         });
//
//         test.test('" #{"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_START), null, 1, 13);
//
//             test.end();
//         });
//
//         test.test('" baz"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'baz', 1, 16);
//
//             test.end();
//         });
//
//         test.test('" + "', function (test) {
//             testToken(test, stream.expect(TokenType.OPERATOR), '+', 1, 20);
//
//             test.end();
//         });
//
//         test.test('"1"', function (test) {
//             testToken(test, stream.expect(TokenType.NUMBER), '1', 1, 22);
//
//             test.end();
//         });
//
//         test.test('" }"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_END), null, 1, 23);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 26);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 29, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithEscapedInterpolation', function (test) {
//         let template = '{{ "bar \\#{baz+1}" }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('""bar \\#{baz+1}""', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'bar #{baz+1}', 1, 4);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 19);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 22, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithHash', function (test) {
//         let template = '{{ "bar # baz" }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('""bar # baz""', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'bar # baz', 1, 5);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 15);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 18, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithUnterminatedInterpolation', function (test) {
//         let template = '{{ "bar #{x" }}';
//
//         let lexer = createLexer();
//
//         test.throws(function () {
//             lexer.tokenize(new TwingSource(template, 'index'));
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithNestedInterpolations', function (test) {
//         let template = '{{ "bar #{ "foo#{bar}" }" }}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('""bar "', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'bar ', 1, 5);
//
//             test.end();
//         });
//
//         test.test('"#{"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_START), null, 1, 9);
//
//             test.end();
//         });
//
//         test.test('""foo"', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'foo', 1, 13);
//
//             test.end();
//         });
//
//         test.test('"#{"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_START), null, 1, 16);
//
//             test.end();
//         });
//
//         test.test('"bar"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'bar', 1, 18);
//
//             test.end();
//         });
//
//         test.test('"}"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_END), null, 1, 21);
//
//             test.end();
//         });
//
//         test.test('" }"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_END), null, 1, 23);
//
//             test.end();
//         });
//
//         test.test('" }}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 1, 26);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 29, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testStringWithNestedInterpolationsInBlock', function (test) {
//         let template = '{% foo "bar #{ "foo#{bar}" }" %}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{%"', function (test) {
//             testToken(test, stream.expect(TokenType.TAG_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"foo"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'foo', 1, 4);
//
//             test.end();
//         });
//
//         test.test('""bar "', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'bar ', 1, 9);
//
//             test.end();
//         });
//
//         test.test('"#{"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_START), null, 1, 13);
//
//             test.end();
//         });
//
//         test.test('"foo"', function (test) {
//             testToken(test, stream.expect(TokenType.STRING), 'foo', 1, 17);
//
//             test.end();
//         });
//
//         test.test('"#{"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_START), null, 1, 20);
//
//             test.end();
//         });
//
//         test.test('"bar"', function (test) {
//             testToken(test, stream.expect(TokenType.NAME), 'bar', 1, 22);
//
//             test.end();
//         });
//
//         test.test('"}"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_END), null, 1, 25);
//
//             test.end();
//         });
//
//         test.test('" }"', function (test) {
//             testToken(test, stream.expect(TokenType.INTERPOLATION_END), null, 1, 27);
//
//             test.end();
//         });
//
//         test.test('" %}"', function (test) {
//             testToken(test, stream.expect(TokenType.TAG_END), null, 1, 30);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 1, 33, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testOperatorEndingWithALetterAtTheEndOfALine', function (test) {
//         let template = '{{ 1 and\n0}}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"{{"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_START), null, 1, 1);
//
//             test.end();
//         });
//
//         test.test('"1"', function (test) {
//             testToken(test, stream.expect(TokenType.NUMBER), '1', 1, 4);
//
//             test.end();
//         });
//
//         test.test('"and"', function (test) {
//             testToken(test, stream.expect(TokenType.OPERATOR), 'and', 1, 6);
//
//             test.end();
//         });
//
//         test.test('"\n0"', function (test) {
//             testToken(test, stream.expect(TokenType.NUMBER), '0', 2, 1);
//
//             test.end();
//         });
//
//         test.test('"}}"', function (test) {
//             testToken(test, stream.expect(TokenType.VAR_END), null, 2, 2);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 2, 4, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('testUnterminatedVariable', function (test) {
//         let template = '{{ bar ';
//
//         let lexer = createLexer();
//         let source = new TwingSource(template, 'index');
//
//         test.throws(function () {
//             lexer.tokenize(source);
//         }, new TwingErrorSyntax('Unclosed "variable".', 1, source));
//
//         test.end();
//     });
//
//     test.test('testUnterminatedBlock', function (test) {
//         let template = '{% bar ';
//
//         let lexer = createLexer();
//         let source = new TwingSource(template, 'index');
//
//         test.throws(function () {
//             lexer.tokenize(source);
//         }, new TwingErrorSyntax('Unclosed "block".', 1, source));
//
//         test.end();
//     });
//
//     test.test('should normalize new lines', function (test) {
//         let template = '\r\rfoo\r\nbar\roof\n\r';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         test.test('"\\n\\nfoo\\nbar\\noof\\n\\n"', function (test) {
//             testToken(test, stream.expect(TokenType.TEXT), '\n\nfoo\nbar\noof\n\n', 1, 1);
//
//             test.end();
//         });
//
//         test.test('EOF', function (test) {
//             testToken(test, stream.getCurrent(), null, 7, 1, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('lexExpression', function (test) {
//         test.test('punctuation', function (test) {
//             let template = '{{ foo) }}';
//
//             let lexer = createLexer();
//             let source = new TwingSource(template, 'index');
//
//             test.throws(function () {
//                 lexer.tokenize(source);
//             }, new TwingErrorSyntax('Unexpected ")".', 1, source));
//
//
//             template = '{{ foo( }}';
//             source = new TwingSource(template, 'index');
//
//             test.throws(function () {
//                 lexer.tokenize(source);
//             }, new TwingErrorSyntax('Unclosed ")".', 1, source));
//
//             test.end();
//         });
//
//         test.test('unlexable', function (test) {
//             let template = '{{ ^ }}';
//
//             let lexer = createLexer();
//             let source = new TwingSource(template, 'index');
//
//             test.throws(function () {
//                 lexer.tokenize(source);
//             }, new TwingErrorSyntax('Unexpected character "^ }}" in "{{ ^ }}".', 1, source));
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('lexRawData', function (test) {
//         test.test('unclosed verbatim', function (test) {
//             let template = '{% verbatim %}';
//
//             let lexer = createLexer();
//             let source = new TwingSource(template, 'index');
//
//             test.throws(function () {
//                 lexer.tokenize(source);
//             }, new TwingErrorSyntax('Unexpected end of file: Unclosed "verbatim" block.', 1, source));
//
//             test.end();
//         });
//
//         test.end();
//     });
//
//     test.test('lexComment', function (test) {
//         let template = '{# foo #}';
//
//         let lexer = createLexer();
//         let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//         testToken(test, stream.expect(TokenType.COMMENT_START), null, 1, 1);
//         testToken(test, stream.expect(TokenType.TEXT), ' foo ', 1, 3);
//         testToken(test, stream.expect(TokenType.COMMENT_END), null, 1, 8);
//         testToken(test, stream.getCurrent(), null, 1, 10, TokenType.EOF);
//
//         test.test('long comments', function (test) {
//             let value = '*'.repeat(100000);
//             let template = '{#' + value + '#}';
//
//             let lexer = createLexer();
//             let stream = lexer.tokenize(new TwingSource(template, 'index'));
//
//             testToken(test, stream.expect(TokenType.COMMENT_START), null, 1, 1);
//             testToken(test, stream.expect(TokenType.TEXT), value, 1, 3);
//             testToken(test, stream.expect(TokenType.COMMENT_END), null, 1, 100003);
//             testToken(test, stream.getCurrent(), null, 1, 100005, TokenType.EOF);
//
//             test.end();
//         });
//
//         test.test('unclosed comment', function (test) {
//             let template = '{#';
//
//             let lexer = createLexer();
//             let source = new TwingSource(template, 'index');
//
//             test.throws(function () {
//                 lexer.tokenize(source);
//             }, new TwingErrorSyntax('Unclosed comment.', 1, source));
//
//             test.end();
//         });
//
//         test.end();
//     });

    test.end();
});
