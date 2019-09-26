const {
    TwingTokenParserSet,
    TwingTokenStream,
    TwingNode,
    TwingSource,
    TwingErrorSyntax
} = require('../../../../../../dist/cjs/main');
const TwingTestMockBuilderParser = require('../../../../../mock-builder/parser');

const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/set', function (test) {
    test.test('parse', function (test) {
        test.test('when direct assignment', function (test) {
            test.test('when different number of variables and assignments', function (test) {
                let stream = new TwingTokenStream([
                    new Token(TokenType.OPERATOR, '=', 1, 1),
                    new Token(TokenType.TAG_END, null, 1, 1),
                    new Token(TokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);

                tokenParser.setParser(parser);

                sinon.stub(parser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo']])));
                sinon.stub(parser, 'parseMultitargetExpression').returns(new TwingNode(new Map([[0, 'oof'], [1, 'bar']])));

                test.throws(function () {
                    tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1))
                }, new TwingErrorSyntax('When using set, you must have the same number of variables and assignments.', 1, new TwingSource('', '')));

                test.end();
            });

            test.end();
        });

        test.test('when capture', function (test) {
            test.test('when multiple targets', function (test) {
                let stream = new TwingTokenStream([
                    new Token(TokenType.TAG_END, null, 1, 1),
                    new Token(TokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = TwingTestMockBuilderParser.getParser(stream);

                tokenParser.setParser(parser);

                sinon.stub(parser, 'parseAssignmentExpression').returns(new TwingNode(new Map([[0, 'foo'], [1, 'bar']])));

                test.throws(function () {
                    tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1))
                }, new TwingErrorSyntax('When using set with a block, you cannot have a multi-target.', 1, new TwingSource('', '')));

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});