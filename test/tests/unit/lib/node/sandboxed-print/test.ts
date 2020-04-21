import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeSandboxedPrint, type} from "../../../../../../src/lib/node/sandboxed-print";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/sandboxed-print', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeSandboxedPrint(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeSandboxedPrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `outputBuffer.echo(this.env.ensureToStringAllowed(\`foo\`));
`);

        test.end();
    });

    test.end();
});
