const TwingNodeExpressionTestDefined = require('../../../../../../../lib/twing/node/expression/test/defined').TwingNodeExpressionTestDefined;
const TwingNodeExpressionUnaryNeg = require('../../../../../../../lib/twing/node/expression/unary/neg').TwingNodeExpressionUnaryNeg;
const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingErrorSyntax = require('../../../../../../../lib/twing/error/syntax').TwingErrorSyntax;

const tap = require('tap');

tap.test('node/expression/test/defined', function (test) {
    test.test('constructor', function (test) {
        test.test('when filter is "default" and "EXPRESSION_NAME" or "EXPRESSION_GET_ATTR" node', function (test) {
            test.throws(function () {
                new TwingNodeExpressionTestDefined(
                    new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionConstant('foo', 1), 1),
                    'foo',
                    null,
                    1
                );
            }, new TwingErrorSyntax('The "defined" test only works with simple variables.', 1));

            test.end();
        });

        test.end();
    });

    test.end();
});
