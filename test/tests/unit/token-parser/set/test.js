const {TwingTokenParserSet} = require('../../../../../build/token-parser/set');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken, TwingTokenType} = require('../../../../../build/token');
const {TwingNode} = require('../../../../../build/node');

const TwingTestMockBuilderParser = require('../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/set', function (test) {
    test.test('parse', function (test) {
        test.test('when direct assignment', function (test) {
            test.test('when different number of variables and assignments', function (test) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingTokenType.OPERATOR, '=', 1, 1),
                    new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1),
                    new TwingToken(TwingTokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);
                let expressionParser = parser.getExpressionParser();

                tokenParser.setParser(parser);

                sinon.stub(expressionParser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo']])));
                sinon.stub(expressionParser, 'parseMultitargetExpression').returns(new TwingNode(new Map([[0, 'oof'], [1, 'bar']])));

                try {
                    tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'set', 1, 1));

                    test.fail('should throw an error');
                }
                catch (e) {
                    test.same(e.getRawMessage(), 'When using set, you must have the same number of variables and assignments.')
                }

                test.end();
            });

            test.end();
        });

        test.test('when capture', function (test) {
            test.test('when multiple targets', function (test) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingTokenType.BLOCK_END, null, 1, 1),
                    new TwingToken(TwingTokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);
                let expressionParser = parser.getExpressionParser();

                tokenParser.setParser(parser);

                sinon.stub(expressionParser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo'], [1, 'bar']])));

                try {
                    tokenParser.parse(new TwingToken(TwingTokenType.NAME, 'set', 1, 1));

                    test.fail('should throw an error');
                }
                catch (e) {
                    test.same(e.getRawMessage(), 'When using set with a block, you cannot have a multi-target.')
                }

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});