import * as tape from 'tape';
import {TwingNodeText} from "../../../../../../src/lib/node/text";
import {TwingNodeSandbox} from "../../../../../../src/lib/node/sandbox";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/sandboxed', (test) => {
    test.test('constructor', (test) => {
        let body = new TwingNodeText('foo', 1, 1);
        let node = new TwingNodeSandbox(body, 1, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getType(), TwingNodeType.SANDBOX);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let body = new TwingNodeText('foo', 1, 1);
        let node = new TwingNodeSandbox(body, 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `await (async () => {
    let alreadySandboxed = this.env.isSandboxed();
    if (!alreadySandboxed) {
        this.env.enableSandbox();
    }
    this.echo(\`foo\`);
    if (!alreadySandboxed) {
        this.env.disableSandbox();
    }
})();
`);

        test.end();
    });

    test.end();
});
