const TwingTestMockCompiler = require('../../../../mock/compiler');

const tap = require('tape');
const {TwingNodeSandboxedPrint} = require("../../../../../build/node/sandboxed-print");
const {TwingNodeExpressionConstant} = require("../../../../../build/node/expression/constant");
const {TwingNodeType} = require("../../../../../build/node");

tap.test('node/sandboxed-print', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1, 1);
        let node = new TwingNodeSandboxedPrint(expr, 1, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.PRINT);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeSandboxedPrint(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
this.echo(this.env.ensureToStringAllowed(\`foo\`));
`);

        test.end();
    });

    test.end();
});