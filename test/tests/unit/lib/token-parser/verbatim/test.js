const {
    TwingTokenParserVerbatim,
    TwingTokenStream,
    TwingNodeType
} = require('../../../../../../dist/cjs/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/verbatim', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.TEXT, 'foo', 1, 1),
            new Token(TokenType.TAG_START, null, 1, 1),
            new Token(TokenType.NAME, 'endverbatim', 1, 1),
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserVerbatim();
        let parser = TwingTestMockBuilderParser.getParser(stream);

        tokenParser.setParser(parser);

        let node = tokenParser.parse(new Token(TokenType.TAG_START, null, 1, 1));

        test.same(node.getType(), TwingNodeType.VERBATIM);
        test.same(node.getAttribute('data'), 'foo');

        test.end();
    });

    test.end();
});