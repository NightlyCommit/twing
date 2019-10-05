import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserFor} from "../../../../../../src/lib/token-parser/for";
import {TwingNodeFor} from "../../../../../../src/lib/node/for";
import {TwingNodeExpressionAssignName} from "../../../../../../src/lib/node/expression/assign-name";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNode} from "../../../../../../src/lib/node";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/for', (test) => {
    test.test('checkLoopUsageBody', (test) => {
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