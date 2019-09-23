const {
    TwingTokenParserMacro,
    TwingTokenStream,
    TwingToken,
    TwingNode
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1);
    }

    parseArguments() {
        return new TwingNode();
    }
}

tap.test('token-parser/macro', function (test) {
    test.test('parse', function (test) {
        test.test('when endmacro name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, '(', 1, 1),
                new TwingToken(TwingToken.PUNCTUATION_TYPE, ')', 1, 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
                new TwingToken(TwingToken.TEXT_TYPE, 'FOO', 1, 1),
                new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1, 1),
                new TwingToken(TwingToken.NAME_TYPE, 'endmacro', 1, 1),
                new TwingToken(TwingToken.NAME_TYPE, 'bar', 1, 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserMacro();
            let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'block', 1, 1));

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