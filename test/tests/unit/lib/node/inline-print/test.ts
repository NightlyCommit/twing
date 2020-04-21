import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeInlinePrint, type} from "../../../../../../src/lib/node/inline-print";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/inline-print', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeInlinePrint(expr, 1, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeInlinePrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(\`foo\`)`);

        test.end();
    });

    test.end();
});
