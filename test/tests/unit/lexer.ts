import {Test} from "tape";
import TwingEnvironment from "../../../src/environment";
import TwingLexer from "../../../src/lexer";
import TwingTokenType from "../../../src/token-type";
import TwingSource from "../../../src/source";

const tap = require('tap');

let createLexer = function() {
    return new TwingLexer(new TwingEnvironment(null));
};

let countToken = function (template: string, type: TwingTokenType, value: string = null) {
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

tap.test('lexer', function (test: Test) {
    test.test('testNameLabelForTag', function (test: Test) {
        let lexer = createLexer();
        let data = '{% § %}';

        let stream = lexer.tokenize(new TwingSource(data, 'index'));

        stream.expect(TwingTokenType.BLOCK_START_TYPE);

        test.same(stream.expect(TwingTokenType.NAME_TYPE).getValue(), '§');

        test.end();
    });

    test.test('testNameLabelForFunction', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ §() }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.VAR_START_TYPE);

            test.same(stream.expect(TwingTokenType.NAME_TYPE).getValue(), '§');
        });

        test.end();
    });

    test.test('testBracketsNesting', function (test: Test) {
        let template = '{{ {"a":{"b":"c"}} }}';

        test.equal(countToken(template, TwingTokenType.PUNCTUATION_TYPE, '{'), 2);
        test.equal(countToken(template, TwingTokenType.PUNCTUATION_TYPE, '}'), 2);

        test.end();
    });

    test.test('testLineDirective', function (test: Test) {
        let template = 'foo\nbar\n{% line 10 %}\n{{\nbaz\n}}\n';
        let lexer = createLexer();

        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        // foo\nbar\n
        test.equal(stream.expect(TwingTokenType.TEXT_TYPE).getLine(), 1);
        // \n (after {% line %})
        test.equal(stream.expect(TwingTokenType.TEXT_TYPE).getLine(), 10);
        // {{
        test.equal(stream.expect(TwingTokenType.VAR_START_TYPE).getLine(), 11);
        // baz
        test.equal(stream.expect(TwingTokenType.NAME_TYPE).getLine(), 12);

        test.end();
    });

    test.test('testLineDirectiveInline', function (test: Test) {
        let template = 'foo\nbar{% line 10 %}{{\nbaz\n}}\n';
        let lexer = createLexer();

        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        // foo\nbar
        test.equal(stream.expect(TwingTokenType.TEXT_TYPE).getLine(), 1);
        // {{
        test.equal(stream.expect(TwingTokenType.VAR_START_TYPE).getLine(), 10);
        // baz
        test.equal(stream.expect(TwingTokenType.NAME_TYPE).getLine(), 11);

        test.end();
    });

    test.test('testLongComments', function (test: Test) {
        let template = '{#' + '*'.repeat(100000) + '#}';
        let lexer = createLexer();

        lexer.tokenize(new TwingSource(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongVerbatim', function (test: Test) {
        let template = '{% verbatim %}' + '*'.repeat(100000) + '{% endverbatim %}';
        let lexer = createLexer();

        lexer.tokenize(new TwingSource(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongVar', function (test: Test) {
        let template = '{{ ' + 'x'.repeat(100000) + ' }}';
        let lexer = createLexer();

        lexer.tokenize(new TwingSource(template, 'index'));

        // add a dummy assertion here to satisfy tape, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testLongBlock', function (test: Test) {
        let template = '{% ' + 'x'.repeat(100000) + ' %}';
        let lexer = createLexer();

        lexer.tokenize(new TwingSource(template, 'index'));

        // add a dummy assertion here to satisfy the test, the only thing we want to test is that the code above
        // can be executed without throwing any exceptions
        test.pass('should not throw an exception');

        test.end();
    });

    test.test('testBigNumbers', function (test: Test) {
        let template = '{{ 922337203685477580700 }}';
        let lexer = createLexer();

        let stream = lexer.tokenize(new TwingSource(template, 'index'));

        stream.next();

        let token = stream.next();

        test.equal(token.getValue(), 922337203685477580700);

        test.end();
    });

    test.test('testStringWithEscapedDelimiter', function (test: Test) {
        let fixtures = [
            {template: "{{ 'foo \\' bar' }}", expected: 'foo \' bar'},
            {template: '{{ "foo \\" bar" }}', expected: 'foo " bar'}
        ];

        let lexer = createLexer();

        fixtures.forEach(function(fixture) {
            test.doesNotThrow(function() {
                let stream = lexer.tokenize(new TwingSource(fixture.template, 'index'));

                stream.expect(TwingTokenType.VAR_START_TYPE);
                stream.expect(TwingTokenType.STRING_TYPE, fixture.expected);
            });
        });

        test.end();
    });

    test.test('testStringWithInterpolation', function (test: Test) {
        let lexer = createLexer();
        let data = 'foo {{ "bar #{ baz + 1 }" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.TEXT_TYPE, 'foo ');
            stream.expect(TwingTokenType.VAR_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'bar ');
            stream.expect(TwingTokenType.INTERPOLATION_START_TYPE);
            stream.expect(TwingTokenType.NAME_TYPE, 'baz');
            stream.expect(TwingTokenType.OPERATOR_TYPE, '+');
            stream.expect(TwingTokenType.NUMBER_TYPE, '1');
            stream.expect(TwingTokenType.INTERPOLATION_END_TYPE);
            stream.expect(TwingTokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithEscapedInterpolation', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ "bar \\#{baz+1}" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.VAR_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'bar #{baz+1}');
            stream.expect(TwingTokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithHash', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ "bar # baz" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.VAR_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'bar # baz');
            stream.expect(TwingTokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithUnterminatedInterpolation', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ "bar #{x" }}';

        test.throws(function() {
            lexer.tokenize(new TwingSource(data, 'index'));
        });

        test.end();
    });

    test.test('testStringWithNestedInterpolations', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ "bar #{ "foo#{bar}" }" }}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.VAR_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'bar ');
            stream.expect(TwingTokenType.INTERPOLATION_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'foo');
            stream.expect(TwingTokenType.INTERPOLATION_START_TYPE);
            stream.expect(TwingTokenType.NAME_TYPE, 'bar');
            stream.expect(TwingTokenType.INTERPOLATION_END_TYPE);
            stream.expect(TwingTokenType.INTERPOLATION_END_TYPE);
            stream.expect(TwingTokenType.VAR_END_TYPE);
        });

        test.end();
    });

    test.test('testStringWithNestedInterpolationsInBlock', function (test: Test) {
        let lexer = createLexer();
        let data = '{% foo "bar #{ "foo#{bar}" }" %}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.BLOCK_START_TYPE);
            stream.expect(TwingTokenType.NAME_TYPE, 'foo');
            stream.expect(TwingTokenType.STRING_TYPE, 'bar ');
            stream.expect(TwingTokenType.INTERPOLATION_START_TYPE);
            stream.expect(TwingTokenType.STRING_TYPE, 'foo');
            stream.expect(TwingTokenType.INTERPOLATION_START_TYPE);
            stream.expect(TwingTokenType.NAME_TYPE, 'bar');
            stream.expect(TwingTokenType.INTERPOLATION_END_TYPE);
            stream.expect(TwingTokenType.INTERPOLATION_END_TYPE);
            stream.expect(TwingTokenType.BLOCK_END_TYPE);
        });

        test.end();
    });

    test.test('testOperatorEndingWithALetterAtTheEndOfALine', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ 1 and\n0}}';

        test.doesNotThrow(function() {
            let stream = lexer.tokenize(new TwingSource(data, 'index'));

            stream.expect(TwingTokenType.VAR_START_TYPE);
            stream.expect(TwingTokenType.NUMBER_TYPE, 1);
            stream.expect(TwingTokenType.OPERATOR_TYPE, 'and');
        });

        test.end();
    });

    test.test('testUnterminatedVariable', function (test: Test) {
        let lexer = createLexer();
        let data = '{{ bar ';

        test.throws(function() {
            lexer.tokenize(new TwingSource(data, 'index'));
        });

        test.end();
    });

    test.test('testUnterminatedBlock', function (test: Test) {
        let lexer = createLexer();
        let data = '{% bar ';

        test.throws(function() {
            lexer.tokenize(new TwingSource(data, 'index'));
        });

        test.end();
    });

    test.end();
});
