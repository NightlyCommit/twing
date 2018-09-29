const {
    TwingTokenParserExtends,
    TwingTokenStream,
    TwingToken,
    TwingErrorSyntax,
    TwingSource
} = require('../../../../../../dist/index');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

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
                tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'foo', 1));
            }, new TwingErrorSyntax('Multiple extends tags are forbidden.', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});