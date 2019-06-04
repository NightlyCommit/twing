const {TwingTokenParserUse} = require('../../../../../build/token-parser/use');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');
const {TwingNode} = require('../../../../../build/node');
const {TwingErrorSyntax} = require('../../../../../build/error/syntax');
const {TwingSource} = require('../../../../../build/source');
const {TwingNodeExpressionConstant} = require('../../../../../build/node/expression/constant');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/use', function (test) {
    test.test('parse', function (test) {
        test.test('when template name is not a "EXPRESSION_CONSTANT"', function (test) {
            let stream = new TwingTokenStream([]);
            let tokenParser = new TwingTokenParserUse();
            let parser = TwingTestMockBuilderParser.getParser(stream);
            let expressionParser = parser.getExpressionParser();

            tokenParser.setParser(parser);

            sinon.stub(expressionParser, 'parseExpression').returns(new TwingNode());
            sinon.stub(stream, 'getCurrent').returns({
                getLine: function() {
                    return 1;
                }
            });

            test.throws(function () {
                tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'set', 1, 1))
            }, new TwingErrorSyntax('The template references in a "use" statement must be a string.', 1, new TwingSource('', '')));

            test.end();
        });

        test.test('when multiple aliases', function (test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingTokenType.NAME, 'with', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'bar', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'as', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'rab', 1, 1),
                new TwingToken(TwingTokenType.PUNCTUATION, ',', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'foo', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'as', 1, 1),
                new TwingToken(TwingTokenType.NAME, 'oof', 1, 1),
                new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1),
                new TwingToken(TwingTokenType.EOF, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserUse();
            let parser = TwingTestMockBuilderParser.getParser(stream);
            let expressionParser = parser.getExpressionParser();

            tokenParser.setParser(parser);

            let trait = null;

            sinon.stub(expressionParser, 'parseExpression').returns(new TwingNodeExpressionConstant('foo', 1, 1));
            sinon.stub(parser, 'addTrait').callsFake((node) => {
                trait = node;
            });

            tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'set', 1, 1));

            test.equals(trait.getNode('targets').getNodes().size, 2);

            test.end();
        });

        test.end();
    });

    test.end();
});