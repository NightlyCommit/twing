import * as test from 'tape';
import Lexer from "../src/lexer";
import Source from "../src/source";
import TokenType from "../src/token-type";
import TwingEnvironment from "../src/environment";

let createLexer = function() {
    return new Lexer(new TwingEnvironment(null));
};

let countToken = function (template: string, type: TokenType, value: string = null) {
    let lexer = createLexer();
    let stream = lexer.tokenize(new Source(template, 'index'));
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

test('lexer', function (test) {
    test.plan(20);

    test.test('testNameLabelForTag', function (test) {
        let lexer = createLexer();
        let data = '{% § %}';

        let stream = lexer.tokenize(new Source(data, 'index'));

        stream.expect(TokenType.BLOCK_START_TYPE);

        test.same(stream.expect(TokenType.NAME_TYPE).getValue(), '§');

        test.end();
    });

    test.test('testNameLabelForFunction', function (test) {
        let lexer = createLexer();
        let data = '{{ §() }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.VAR_START_TYPE);

            test.same(stream.expect(TokenType.NAME_TYPE).getValue(), '§');
        });

        test.end();
    });

    test.test('testBracketsNesting', function (test) {
        let template = '{{ {"a":{"b":"c"}} }}';

        test.equal(countToken(template, TokenType.PUNCTUATION_TYPE, '{'), 2);
        test.equal(countToken(template, TokenType.PUNCTUATION_TYPE, '}'), 2);

        test.end();
    });

    test.test('testLineDirective', function (test) {
        let template = 'foo\nbar\n{% line 10 %}\n{{\nbaz\n}}\n';
        let lexer = createLexer();

        let stream = lexer.tokenize(new Source(template, 'index'));

        // foo\nbar\n
        test.equal(stream.expect(TokenType.TEXT_TYPE).getLine(), 1);
        // \n (after {% line %})
        test.equal(stream.expect(TokenType.TEXT_TYPE).getLine(), 10);
        // {{
        test.equal(stream.expect(TokenType.VAR_START_TYPE).getLine(), 11);
        // baz
        test.equal(stream.expect(TokenType.NAME_TYPE).getLine(), 12);

        test.end();
    });

    test.test('testLineDirectiveInline', function (test) {
        let template = 'foo\nbar{% line 10 %}{{\nbaz\n}}\n';
        let lexer = createLexer();

        let stream = lexer.tokenize(new Source(template, 'index'));

        // foo\nbar
        test.equal(stream.expect(TokenType.TEXT_TYPE).getLine(), 1);
        // {{
        test.equal(stream.expect(TokenType.VAR_START_TYPE).getLine(), 10);
        // baz
        test.equal(stream.expect(TokenType.NAME_TYPE).getLine(), 11);

        test.end();
    });

    test.test('testLongComments', function (test) {
        let template = '{#' + '*'.repeat(100000) + '#}';
        let lexer = createLexer();

        lexer.tokenize(new Source(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongVerbatim', function (test) {
        let template = '{% verbatim %}' + '*'.repeat(100000) + '{% endverbatim %}';
        let lexer = createLexer();

        lexer.tokenize(new Source(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongVar', function (test) {
        let template = '{{ ' + 'x'.repeat(100000) + ' }}';
        let lexer = createLexer();

        lexer.tokenize(new Source(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongBlock', function (test) {
        let template = '{% ' + 'x'.repeat(100000) + ' %}';
        let lexer = createLexer();

        lexer.tokenize(new Source(template, 'index'));

        // add a dummy assertion here to satisfy the test, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testBigNumbers', function (test) {
        let template = '{{ 922337203685477580700 }}';
        let lexer = createLexer();

        let stream = lexer.tokenize(new Source(template, 'index'));

        stream.next();

        let token = stream.next();

        test.equal(token.getValue(), '922337203685477580700');

        test.end();
    });

    test.test('testStringWithEscapedDelimiter', function (test) {
        let fixtures = [
            {template: "{{ 'foo \\' bar' }}", expected: 'foo \' bar'},
            {template: '{{ "foo \\" bar" }}', expected: 'foo " bar'}
        ];

        let lexer = createLexer();

        fixtures.forEach(function(fixture) {
            test.doesNotThrow(function() {
                let stream = lexer.tokenize(new Source(fixture.template, 'index'));

                stream.expect(TokenType.VAR_START_TYPE);
                stream.expect(TokenType.STRING_TYPE, fixture.expected);
            });
        });

        test.end();
    });

    test.test('testStringWithInterpolation', function (test) {
        let lexer = createLexer();
        let data = 'foo {{ "bar #{ baz + 1 }" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.TEXT_TYPE, 'foo ');
            stream.expect(TokenType.VAR_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'bar ');
            stream.expect(TokenType.INTERPOLATION_START_TYPE);
            stream.expect(TokenType.NAME_TYPE, 'baz');
            stream.expect(TokenType.OPERATOR_TYPE, '+');
            stream.expect(TokenType.NUMBER_TYPE, '1');
            stream.expect(TokenType.INTERPOLATION_END_TYPE);
            stream.expect(TokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithEscapedInterpolation', function (test) {
        let lexer = createLexer();
        let data = '{{ "bar \\#{baz+1}" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.VAR_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'bar #{baz+1}');
            stream.expect(TokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithHash', function (test) {
        let lexer = createLexer();
        let data = '{{ "bar # baz" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.VAR_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'bar # baz');
            stream.expect(TokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithUnterminatedInterpolation', function (test) {
        let lexer = createLexer();
        let data = '{{ "bar #{x" }}';

        test.throws(function() {
            lexer.tokenize(new Source(data, 'index'));
        });

        test.end();
    });

    test.test('testStringWithNestedInterpolations', function (test) {
        let lexer = createLexer();
        let data = '{{ "bar #{ "foo#{bar}" }" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.VAR_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'bar ');
            stream.expect(TokenType.INTERPOLATION_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'foo');
            stream.expect(TokenType.INTERPOLATION_START_TYPE);
            stream.expect(TokenType.NAME_TYPE, 'bar');
            stream.expect(TokenType.INTERPOLATION_END_TYPE);
            stream.expect(TokenType.INTERPOLATION_END_TYPE);
            stream.expect(TokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithNestedInterpolationsInBlock', function (test) {
        let lexer = createLexer();
        let data = '{% foo "bar #{ "foo#{bar}" }" %}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.BLOCK_START_TYPE);
            stream.expect(TokenType.NAME_TYPE, 'foo');
            stream.expect(TokenType.STRING_TYPE, 'bar ');
            stream.expect(TokenType.INTERPOLATION_START_TYPE);
            stream.expect(TokenType.STRING_TYPE, 'foo');
            stream.expect(TokenType.INTERPOLATION_START_TYPE);
            stream.expect(TokenType.NAME_TYPE, 'bar');
            stream.expect(TokenType.INTERPOLATION_END_TYPE);
            stream.expect(TokenType.INTERPOLATION_END_TYPE);
            stream.expect(TokenType.BLOCK_END_TYPE);
        });

        test.end();
    });

    test.test('testOperatorEndingWithALetterAtTheEndOfALine', function (test) {
        let lexer = createLexer();
        let data = '{{ 1 and\n0}}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new Source(data, 'index'));

            stream.expect(TokenType.VAR_START_TYPE);
            stream.expect(TokenType.NUMBER_TYPE, 1);
            stream.expect(TokenType.OPERATOR_TYPE, 'and');
        });

        test.end();
    });

    test.test('testUnterminatedVariable', function (test) {
        let lexer = createLexer();
        let data = '{{ bar ';

        test.throws(function() {
            lexer.tokenize(new Source(data, 'index'));
        });

        test.end();
    });

    test.test('testUnterminatedBlock', function (test) {
        let lexer = createLexer();
        let data = '{% bar ';

        test.throws(function() {
            lexer.tokenize(new Source(data, 'index'));
        });

        test.end();
    });
});
