import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionConditional} from "../../../../../../../src/lib/node/expression/conditional";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/conditional', (test) => {
    test.test('constructor', (test) => {
        let expr1 = new TwingNodeExpressionConstant(1, 1, 1);
        let expr2 = new TwingNodeExpressionConstant(2, 1, 1);
        let expr3 = new TwingNodeExpressionConstant(3, 1, 1);
        let node = new TwingNodeExpressionConditional(expr1, expr2, expr3, 1, 1);

        test.same(node.getNode('expr1'), expr1);
        test.same(node.getNode('expr2'), expr2);
        test.same(node.getNode('expr3'), expr3);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        let expr1 = new TwingNodeExpressionConstant(1, 1, 1);
        let expr2 = new TwingNodeExpressionConstant(2, 1, 1);
        let expr3 = new TwingNodeExpressionConstant(3, 1, 1);
        let node = new TwingNodeExpressionConditional(expr1, expr2, expr3, 1, 1);

        test.same(compiler.compile(node).getSource(), '((1) ? (2) : (3))');
        test.end();
    });

    test.end();
});
