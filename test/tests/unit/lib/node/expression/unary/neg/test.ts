import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionUnaryNeg} from "../../../../../../../../src/lib/node/expression/unary/neg";
import {TwingNodeType} from "../../../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../../../mock/compiler";

tape('node/expression/unary/neg', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNeg(expr, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getType(), TwingNodeType.EXPRESSION_UNARY_NEG);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        test.test('basic', (test) => {
            let expr = new TwingNodeExpressionConstant(1, 1, 1);
            let node = new TwingNodeExpressionUnaryNeg(expr, 1, 1);

            test.same(compiler.compile(node).getSource(), ' -1');

            test.end();
        });

        test.test('with unary neg as body', (test) => {
            let expr = new TwingNodeExpressionConstant(1, 1, 1);
            let node = new TwingNodeExpressionUnaryNeg(new TwingNodeExpressionUnaryNeg(expr, 1, 1), 1, 1);

            test.same(compiler.compile(node).getSource(), ' - -1');

            test.end();
        });

        test.end();
    });

    test.end();
});
