const {
    TwingTokenParserSet,
    TwingTokenStream,
    TwingToken,
    TwingNode,
    TwingSource,
    TwingErrorSyntax
} = require('../../../../../../dist/index');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/set', function (test) {
    test.test('parse', function (test) {
        test.test('when direct assignment', function (test) {
            test.test('when different number of variables and assignments', function (test) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingToken.OPERATOR_TYPE, '=', 1),
                    new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1),
                    new TwingToken(TwingToken.EOF_TYPE, null, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);
                let expressionParser = parser.getExpressionParser();

                tokenParser.setParser(parser);

                sinon.stub(expressionParser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo']])));
                sinon.stub(expressionParser, 'parseMultitargetExpression').returns(new TwingNode(new Map([[0, 'oof'], [1, 'bar']])));

                test.throws(function () {
                    tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'set', 1))
                }, new TwingErrorSyntax('When using set, you must have the same number of variables and assignments.', 1, new TwingSource('', '')));

                test.end();
            });

            test.end();
        });

        test.test('when capture', function (test) {
            test.test('when multiple targets', function (test) {
                let stream = new TwingTokenStream([
                    new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1),
                    new TwingToken(TwingToken.EOF_TYPE, null, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);
                let expressionParser = parser.getExpressionParser();

                tokenParser.setParser(parser);

                sinon.stub(expressionParser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo'], [1, 'bar']])));

                test.throws(function () {
                    tokenParser.parse(new TwingToken(TwingToken.NAME_TYPE, 'set', 1))
                }, new TwingErrorSyntax('When using set with a block, you cannot have a multi-target.', 1, new TwingSource('', '')));

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});