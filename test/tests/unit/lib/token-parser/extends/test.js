const {
    TwingTokenParserExtends,
    TwingTokenStream,
    TwingErrorSyntax,
    TwingSource
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

class ExpressionParser {
    parseExpression() {}
}

tap.test('token-parser/extends', function (test) {
    test.test('parse', function (test) {
        test.test('with parent already set', function(test) {
            let stream = new TwingTokenStream([]);

            let tokenParser = new TwingTokenParserExtends();
            let parser = TwingTestMockBuilderParser.getParser(stream);

            tokenParser.setParser(parser);

            sinon.stub(parser, 'isMainScope').returns(true);
            sinon.stub(parser, 'getParent').returns(true);

            test.throws(function () {
                tokenParser.parse(new Token(TokenType.NAME, 'foo', 1, 1));
            }, new TwingErrorSyntax('Multiple extends tags are forbidden.', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});