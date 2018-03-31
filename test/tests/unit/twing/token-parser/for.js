const TwingTokenParserFor = require('../../../../../lib/twing/token-parser/for').TwingTokenParserFor;
const TwingTokenStream = require('../../../../../lib/twing/token-stream').TwingTokenStream;
const TwingToken = require('../../../../../lib/twing/token').TwingToken;
const TwingNode = require('../../../../../lib/twing/node').TwingNode;
const TwingNodeFor = require('../../../../../lib/twing/node/for').TwingNodeFor;
const TwingNodeExpressionAssignName = require('../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');
const sinon = require('sinon');

tap.test('token-parser/for', function (test) {
    test.test('checkLoopUsageBody', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_END_TYPE, null, 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1)
        ]);

        let tokenParser = new TwingTokenParserFor();

        let checkLoopUsageBody = Reflect.get(tokenParser, 'checkLoopUsageBody').bind(tokenParser);
        let checkLoopUsageBodySpy = sinon.spy(tokenParser, 'checkLoopUsageBody');

        checkLoopUsageBody(stream, new TwingNodeFor(new TwingNodeExpressionAssignName('foo', 1), new TwingNodeExpressionAssignName('bar', 1), new TwingNodeExpressionConstant(1, 1), new TwingNodeExpressionConstant(1, 1), new TwingNode(), new TwingNode(), 1));

        test.true(checkLoopUsageBodySpy.notCalled);

        test.end();
    });

    test.end();
});