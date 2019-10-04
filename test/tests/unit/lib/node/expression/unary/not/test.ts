import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionUnaryNot} from "../../../../../../../../src/lib/node/expression/unary/not";
import {MockCompiler} from "../../../../../../../mock/compiler";

tape('node/expression/unary/not', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1, 1);

        test.same(node.getNode('node'), expr);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();
        let expr = new TwingNodeExpressionConstant(1, 1, 1);
        let node = new TwingNodeExpressionUnaryNot(expr, 1, 1);

        test.same(compiler.compile(node).getSource(), ' !1');

        test.end();

    });

    test.end();
});
