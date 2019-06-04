const {TwingTokenStream} = require('../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../build/token');
const {TwingLoaderArray: TwingLoader} = require('../../../../build/loader/array');
const {TwingErrorSyntax} = require('../../../../build/error/syntax');
const {TwingSource} = require('../../../../build/source');
const {TwingEnvironmentNode: TwingEnvironment} = require('../../../../build/environment/node');

const tap = require('tape');

tap.test('token-stream', function (test) {
    test.test('constructor', function (test) {
        let tokens = [
            new TwingToken(TwingTokenType.PUNCTUATION, '{', 1, 1),
            new TwingToken(TwingTokenType.WHITESPACE, '\n ', 1, 1),
            new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
            new TwingToken(TwingTokenType.EOF, null, 1, 1)
        ];

        let stream = new TwingTokenStream(tokens);

        test.same(stream.getTokens(), tokens);

        test.end();
    });

    test.test('should provide textual representation', function (test) {
        let loader = new TwingLoader({
            index: ''
        });
        let twing = new TwingEnvironment(loader);
        let stream = twing.tokenize(new TwingSource('Hello {{ name }}', 'index')).toAst();

        test.same(stream.toString(), `TEXT(Hello )
VAR_START({{)
NAME(name)
VAR_END(}})
EOF()`);

        test.end();
    });

    test.test('next', function (test) {
        let loader = new TwingLoader({
            index: ''
        });
        let twing = new TwingEnvironment(loader);
        let stream = twing.tokenize(new TwingSource('', 'index'));

        test.throws(function () {
            stream.next();
        }, new TwingErrorSyntax('Unexpected end of template.', 1, new TwingSource('', 'index')));

        test.end();
    });

    test.test('look', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingTokenType.PUNCTUATION, '{', 1, 1),
            new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
            new TwingToken(TwingTokenType.EOF, null, 1, 1)
        ]);

        test.same(stream.look().getType(), TwingTokenType.NAME);

        test.throws(function () {
            stream.look(3);
        }, new TwingErrorSyntax('Unexpected end of template.', 1, new TwingSource('', '')));

        test.end();
    });

    test.test('serialize', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingTokenType.PUNCTUATION, '{', 1, 1),
            new TwingToken(TwingTokenType.WHITESPACE, '\n ', 1, 1),
            new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
            new TwingToken(TwingTokenType.EOF, null, 1, 1)
        ]);

        let expected = `{
 foo`;
        let actual = stream.serialize();

        test.same(actual, expected);

        test.end();
    });

    test.test('toAst', function(test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingTokenType.TEXT, '\\a', 1, 1),
            new TwingToken(TwingTokenType.TEXT, '\\n', 1, 3),
            new TwingToken(TwingTokenType.WHITESPACE, ' ', 1, 5),
            new TwingToken(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_LINE_TRIMMING, ' ', 1, 6),
            new TwingToken(TwingTokenType.WHITESPACE_CONTROL_MODIFIER_TRIMMING, ' ', 1, 7),
            new TwingToken(TwingTokenType.EOF, null, 1, 8)
        ]);

        let ast = stream.toAst();

        test.true(ast.nextIf(TwingTokenType.TEXT, 'a'));
        test.true(ast.nextIf(TwingTokenType.TEXT, '\n'));
        test.same(ast.getCurrent().getType(), TwingTokenType.EOF);

        test.end();
    });

    test.end();
});