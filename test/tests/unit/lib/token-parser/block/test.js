const {
    TwingTokenParserBlock,
    TwingTokenStream,
    TwingToken,
    TwingErrorSyntax,
    TwingSource
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/block', function (test) {
    test.test('parse', function (test) {
        test.test('when endblock name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
                new TwingToken(TwingToken.TEXT_TYPE, 'FOO', 1, 1),
                new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1, 1),
                new TwingToken(TwingToken.NAME_TYPE, 'endblock', 1, 1),
                new TwingToken(TwingToken.NAME_TYPE, 'bar', 1, 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserBlock();
            let parser = TwingTestMockBuilderParser.getParser(stream);

            sinon.stub(parser, 'parseExpression').returns(new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1));

            tokenParser.setParser(parser);

            test.throws(function () {
                tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'block', 1, 1));
            }, new TwingErrorSyntax('Expected endblock for block "foo" (but "bar" given).', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});