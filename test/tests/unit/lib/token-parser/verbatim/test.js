const {
    TwingTokenParserVerbatim,
    TwingTokenStream,
    TwingToken,
    TwingNodeType
} = require('../../../../../../build/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');

tap.test('token-parser/verbatim', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
            new TwingToken(TwingToken.TEXT_TYPE, 'foo', 1, 1),
            new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1, 1),
            new TwingToken(TwingToken.NAME_TYPE, 'endverbatim', 1, 1),
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserVerbatim();
        let parser = TwingTestMockBuilderParser.getParser(stream);

        tokenParser.setParser(parser);

        let node = tokenParser.parse(new TwingToken(TwingToken.BLOCK_START_TYPE, null, 1, 1));

        test.same(node.getType(), TwingNodeType.VERBATIM);
        test.same(node.getAttribute('data'), 'foo');

        test.end();
    });

    test.end();
});