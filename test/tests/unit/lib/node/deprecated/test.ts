import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeDeprecated} from "../../../../../../src/lib/node/deprecated";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";
import {TwingNodeExpressionName} from "../../../../../../src/lib/node/expression/name";

tape('node/deprecated', (test) => {
    test.test('constructor', (test) => {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeDeprecated(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.DEPRECATED);

        test.end();
    });

    test.test('compile', (test) => {
        test.test('with constant', (test) => {
            let expr = new TwingNodeExpressionConstant('foo', 1, 1);
            let node = new TwingNodeDeprecated(expr, 1, 1);
            let compiler = new MockCompiler();

            node.setTemplateName('bar');

            test.same(compiler.compile(node).getSource(), `console.warn(\`foo\` + \` ("bar" at line 1)\`);
`);

            test.end();
        });

        test.test('with variable', (test) => {
            let expr = new TwingNodeExpressionName('foo', 1, 1);
            let node = new TwingNodeDeprecated(expr, 1, 1);
            let compiler = new MockCompiler();

            node.setTemplateName('bar');

            test.same(compiler.compile(node).getSource(), `let __internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa = (context.has(\`foo\`) ? context.get(\`foo\`) : null);
console.warn(__internal_480b6d2e4b70b4ccce4936e035b2ead64f8213fee7b9a90a92d1f2d0fee68eaa + \` ("bar" at line 1)\`);
`);

            test.end();
        });

        test.end();
    });

    test.end();
});
