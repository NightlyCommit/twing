import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeDo, type} from "../../../../../../src/lib/node/do";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/do', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDo(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.type, type);

        test.end();
    });

    test.test('compile', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDo(expr, 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `\`foo\`;
`);

        test.end();
    });

    test.end();
});
