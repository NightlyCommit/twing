const {TwingTokenParserVerbatim} = require('../../../../../build/token-parser/verbatim');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');
const {TwingNodeType} = require('../../../../../build/node');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');

class ExpressionParser {
    parseExpression() {
        return new TwingToken(TwingTokenType.NAME, 'foo', 1, 1);
    }
}

tap.test('verbatim', function (test) {
    test.test('parse', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingTokenType.BLOCK_END, '%}', 1, 1),
            new TwingToken(TwingTokenType.TEXT, '{{foo{%   \nbar', 1, 1),
            new TwingToken(TwingTokenType.BLOCK_START, '{%', 1, 1),
            new TwingToken(TwingTokenType.NAME, 'endverbatim', 1, 1),
            new TwingToken(TwingTokenType.BLOCK_END, '%}', 1, 1),
            new TwingToken(TwingTokenType.EOF, null, 1, 1),
        ]);

        let tokenParser = new TwingTokenParserVerbatim();
        let parser = TwingTestMockBuilderParser.getParser(stream, new ExpressionParser());

        tokenParser.setParser(parser);

        let node = tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'verbatim', 1, 1));

        test.same(node.getType(), TwingNodeType.VERBATIM);
        test.same(node.getAttribute('data'), '{{foo{%   \nbar');
        test.same(parser.getStream().getCurrent().getType(), TwingTokenType.EOF);

        test.end();
    });

    test.end();
});