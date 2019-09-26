const {
    TwingTokenParserFor,
    TwingTokenStream,
    TwingNode,
    TwingNodeFor,
    TwingNodeExpressionAssignName,
    TwingNodeExpressionConstant
} = require('../../../../../../dist/cjs/main');

const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/for', function (test) {
    test.test('checkLoopUsageBody', function (test) {
        let stream = new TwingTokenStream([
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserFor();

        let checkLoopUsageBody = Reflect.get(tokenParser, 'checkLoopUsageBody').bind(tokenParser);
        let checkLoopUsageBodySpy = sinon.spy(tokenParser, 'checkLoopUsageBody');

        checkLoopUsageBody(stream, new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionAssignName('bar', 1, 1), new TwingNodeExpressionConstant(1, 1, 1), new TwingNodeExpressionConstant(1, 1, 1), new TwingNode(), new TwingNode(),1, 1));

        test.true(checkLoopUsageBodySpy.notCalled);

        test.end();
    });

    test.end();
});