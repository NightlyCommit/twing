const {
    TwingTokenParserMacro,
    TwingTokenStream,
    TwingToken,
    TwingErrorSyntax,
    TwingSource,
    TwingNode
} = require('../../../../../../build/index');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingToken.NAME_TYPE, 'foo', 1);
    }

    parseArguments() {
        return new TwingNode();
    }
}

tap.test('token-parser/macro', function (test) {
    test.test('parse', function (test) {
        test.test('when endmacro name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1),
                new TwingToken(TwingToken.TEXT_TYPE, 'FOO', 1),
                new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1),
                new TwingToken(TwingToken.NAME_TYPE, 'endmacro', 1),
                new TwingToken(TwingToken.NAME_TYPE, 'bar', 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1)
            ]);

            let tokenParser = new TwingTokenParserMacro();
            let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

            tokenParser.setParser(parser);

            test.throws(function () {
                tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'block', 1));
            }, new TwingErrorSyntax('Expected endmacro for macro "foo" (but "bar" given).', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});