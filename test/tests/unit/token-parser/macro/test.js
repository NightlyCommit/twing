const {TwingTokenParserMacro} = require('../../../../../build/token-parser/macro');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');
const {TwingNode} = require('../../../../../build/node');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingTokenType.NAME, 'foo', 1, 1);
    }

    parseArguments() {
        return new TwingNode();
    }
}

tap.test('token-parser/macro', function (test) {
    test.test('parse', function (test) {
        test.test('when endmacro name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_END, '%}', 1, 1),
                new TwingToken(TwingTokenType.TEXT, 'FOO', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_START, '{%', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'endmacro', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'bar', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_END, '%}', 1, 1)
            ]);

            let tokenParser = new TwingTokenParserMacro();
            let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'macro', 1, 1));

                test.fail('should throw an error');
            }
            catch (e) {
                test.same(e.getRawMessage(), 'Expected endmacro for macro "foo" (but "bar" given).')
            }

            test.end();
        });

        test.end();
    });

    test.end();
});