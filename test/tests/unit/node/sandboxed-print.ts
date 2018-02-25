import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../compiler-stub";
import {TwingNodeExpressionConstant} from "../../../../src/node/expression/constant";
import {TwingNodeSandboxedPrint} from "../../../../src/node/sandboxed-print";
import {TwingNodeType} from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/sandboxed-print', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeSandboxedPrint(expr, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.PRINT);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let node = new TwingNodeSandboxedPrint(new TwingNodeExpressionConstant('foo', 1), 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.echo(this.env.getExtension('TwingExtensionSandbox').ensureToStringAllowed("foo"));
`);

        test.end();
    });

    test.end();
});