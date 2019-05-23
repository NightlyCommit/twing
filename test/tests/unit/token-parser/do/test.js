const {TwingTokenParserDo} = require('../../../../../build/token-parser/do');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken} = require('../../../../../build/token');
const {TwingNodeType} = require('../../../../../build/node');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingToken.NAME_TYPE, 'foo', 1);
    }
}

tap.test('token-parser/do', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1)
        ]);

        let tokenParser = new TwingTokenParserDo();
        let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

        tokenParser.setParser(parser);

        test.same(tokenParser.parse(new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1)).getType(), TwingNodeType.DO);

        test.end();
    });

    test.end();
});