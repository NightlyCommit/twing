const {
    TwingTokenParserBlock,
    TwingTokenStream,
    TwingErrorSyntax,
    TwingSource
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/block', function (test) {
    test.test('parse', function (test) {
        test.test('when endblock name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'foo', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1),
                new Token(TokenType.TEXT, 'FOO', 1, 1),
                new Token(TokenType.TAG_START, null, 1, 1),
                new Token(TokenType.NAME, 'endblock', 1, 1),
                new Token(TokenType.NAME, 'bar', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserBlock();
            let parser = TwingTestMockBuilderParser.getParser(stream);

            sinon.stub(parser, 'parseExpression').returns(new Token(TokenType.NAME, 'foo', 1, 1));

            tokenParser.setParser(parser);

            test.throws(function () {
                tokenParser.parse(new Token(TokenType.NAME, 'block', 1, 1));
            }, new TwingErrorSyntax('Expected endblock for block "foo" (but "bar" given).', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});