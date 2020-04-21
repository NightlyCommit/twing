import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodePrint, type} from "../../../../../../src/lib/node/print";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/print', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodePrint(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(\`foo\`);
`);

        test.end();
    });

    test.end();
});
