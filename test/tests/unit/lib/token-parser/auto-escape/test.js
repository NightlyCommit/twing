const {
    TwingTokenParserAutoEscape,
    TwingTokenStream,
    TwingToken,
    TwingParser,
    TwingErrorSyntax,
    TwingSource
} = require('../../../../../../dist/index');

const tap = require('tape');
const sinon = require('sinon');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingToken.NAME_TYPE, 'foo', 1);
    }
}

class Parser extends TwingParser {
    constructor() {
        super(null);
    }

    getExpressionParser() {
        return new ExpressionParser();
    }
}

tap.test('token-parser/auto-escape', function (test) {
    test.test('parse', function (test) {
        test.test('when escaping strategy is not a string of false', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1)
            ]);

            let tokenParser = new TwingTokenParserAutoEscape();
            let parser = new Parser();

            sinon.stub(parser, 'getStream').returns(stream);

            tokenParser.setParser(parser);

            test.throws(function () {
                tokenParser.parse(new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1));
            }, new TwingErrorSyntax('An escaping strategy must be a string or false.', 1, new TwingSource('', '')));

            test.end();
        });

        test.end();
    });

    test.end();
});