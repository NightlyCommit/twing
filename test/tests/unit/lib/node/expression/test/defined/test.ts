import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionTestDefined} from "../../../../../../../../src/lib/node/expression/test/defined";
import {TwingNodeExpressionUnaryNeg} from "../../../../../../../../src/lib/node/expression/unary/neg";

tape('node/expression/test/defined', (test) => {
    test.test('constructor', (test) => {
        test.test('when filter is "default" and "EXPRESSION_NAME" or "EXPRESSION_GET_ATTR" node', (test) => {
            try {
                new TwingNodeExpressionTestDefined(
                    new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1),
                    'foo',
                    null,
                    1, 1
                );

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'The "defined" test only works with simple variables at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
