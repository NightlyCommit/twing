const {TwingTokenParserBlock} = require('../../../../../build/token-parser/block');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingTokenType.NAME, 'foo', 1, 1);
    }
}

tap.test('token-parser/block', function (test) {
    test.test('parse', function (test) {
        test.test('when endblock name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1),
                new TwingToken(TwingTokenType.TEXT, 'FOO', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_START, null, 1, 1),
                new TwingToken(TwingTokenType.NAME, 'endblock', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'bar', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserBlock();
            let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

            tokenParser.setParser(parser);
            
            try {
                tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'block', 1, 1));

                test.fail('should throw an error');
            }
            catch (e) {
                test.same(e.getRawMessage(), 'Expected endblock for block "foo" (but "bar" given).')
            }
            
            test.end();
        });

        test.end();
    });

    test.end();
});