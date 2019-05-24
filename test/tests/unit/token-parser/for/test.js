const {TwingTokenParserFor} = require('../../../../../build/token-parser/for');
const {TwingTokenStream} = require('../../../../../build/token-stream');
const {TwingToken} = require('../../../../../build/token');
const {TwingNode} = require('../../../../../build/node');
const {TwingNodeFor} = require('../../../../../build/node/for');
const {TwingNodeExpressionAssignName} = require('../../../../../build/node/expression/assign-name');
const {TwingNodeExpressionConstant} = require('../../../../../build/node/expression/constant');

const tap = require('tape');
const sinon = require('sinon');

tap.test('token-parser/for', function (test) {
    test.test('checkLoopUsageBody', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1, 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserFor();

        let checkLoopUsageBody = Reflect.get(tokenParser, 'checkLoopUsageBody').bind(tokenParser);
        let checkLoopUsageBodySpy = sinon.spy(tokenParser, 'checkLoopUsageBody');

        checkLoopUsageBody(stream, new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1, 1), new TwingNodeExpressionAssignName('bar', 1, 1), new TwingNodeExpressionConstant(1, 1, 1), new TwingNodeExpressionConstant(1, 1, 1), new TwingNode(), new TwingNode(), 1, 1));

        test.true(checkLoopUsageBodySpy.notCalled);

        test.end();
    });

    test.end();
});