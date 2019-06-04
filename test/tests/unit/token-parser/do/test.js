const {TwingTokenParserDo} = require('../../../../../build/token-parser/do');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');
const {TwingNodeType} = require('../../../../../build/node');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingTokenType.NAME, 'foo', 1);
    }
}

tap.test('token-parser/do', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1),
            new TwingToken(TwingTokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserDo();
        let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

        tokenParser.setParser(parser);

        test.same(tokenParser.parse(new TwingToken(TwingTokenType.BLOCK_START, null, 1, 1)).getType(), TwingNodeType.DO);

        test.end();
    });

    test.end();
});