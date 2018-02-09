import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeSandboxedPrint from "../../../../src/node/sandboxed-print";
import TwingNodeText from "../../../../src/node/text";
import TwingNodeSandbox from "../../../../src/node/sandbox";

const tap = require('tap');

tap.test('node/sandboxed', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeSandbox(body, 1);

        test.same(node.getNode('body'), body);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let body = new TwingNodeText('foo', 1);
        let node = new TwingNodeSandbox(body, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
(async () => {
    let sandbox = this.env.getExtension('TwingExtensionSandbox');
    let alreadySandboxed = sandbox.isSandboxed();
    if (!alreadySandboxed) {
        sandbox.enableSandbox();
    }
    Twing.echo("foo");
    if (!alreadySandboxed) {
        sandbox.disableSandbox();
    }
})();
`);

        test.end();
    });

    test.end();
});