const {
    TwingTokenParserMacro,
    TwingTokenStream,
    TwingNode
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const {Token, TokenType} = require('twig-lexer');

class ExpressionParser {
    parseExpression() {
        return new Token(TokenType.NAME, 'foo', 1, 1);
    }

    parseArguments() {
        return new TwingNode();
    }
}

tap.test('token-parser/macro', function (test) {
    test.test('parse', function (test) {
        test.test('when endmacro name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'foo', 1, 1),
                new Token(TokenType.PUNCTUATION, '(', 1, 1),
                new Token(TokenType.PUNCTUATION, ')', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1),
                new Token(TokenType.TEXT, 'FOO', 1, 1),
                new Token(TokenType.TAG_START, null, 1, 1),
                new Token(TokenType.NAME, 'endmacro', 1, 1),
                new Token(TokenType.NAME, 'bar', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserMacro();
            let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new Token(TokenType.NAME, 'block', 1, 1));

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'Expected endmacro for macro "foo" (but "bar" given) at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});