const {
    TwingTokenParserDo,
    TwingTokenStream,
    TwingToken,
    TwingNodeType
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/do', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserDo();
        let parser = TwingTestMockBuilderParser.getParser(stream);

        sinon.stub(parser, 'parseExpression').returns(new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1));

        tokenParser.setParser(parser);

        test.same(tokenParser.parse(new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1, 1)).getType(), TwingNodeType.DO);

        test.end();
    });

    test.end();
});