const {
    TwingTokenParserDo,
    TwingTokenStream,
    TwingNodeType
} = require('../../../../../../dist/cjs/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/do', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserDo();
        let parser = TwingTestMockBuilderParser.getParser(stream);

        sinon.stub(parser, 'parseExpression').returns(new Token(TokenType.NAME, 'foo', 1, 1));

        tokenParser.setParser(parser);

        test.same(tokenParser.parse(new Token(TokenType.TAG_START, null, 1, 1)).getType(), TwingNodeType.DO);

        test.end();
    });

    test.end();
});