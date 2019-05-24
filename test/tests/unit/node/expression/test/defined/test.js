const tap = require('tape');
const {TwingNodeExpressionTestDefined} = require("../../../../../../../build/node/expression/test/defined");
const {TwingNodeExpressionUnaryNeg} = require("../../../../../../../build/node/expression/unary/neg");
const {TwingNodeExpressionConstant} = require("../../../../../../../build/node/expression/constant");
const {TwingErrorSyntax} = require("../../../../../../../build/error/syntax");

tap.test('node/expression/test/defined', function (test) {
    test.test('constructor', function (test) {
        test.test('when filter is "default" and "EXPRESSION_NAME" or "EXPRESSION_GET_ATTR" node', function (test) {
            test.throws(function () {
                new TwingNodeExpressionTestDefined(
                    new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1),
                    'foo',
                    null,
                    1,
                    1
                );
            }, new TwingErrorSyntax('The "defined" test only works with simple variables.', 1));

            test.end();
        });

        test.end();
    });

    test.end();
});
