const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeText = require('../../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeSandbox = require('../../../../../lib/twing/node/sandbox').TwingNodeSandbox;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

tap.test('node/sandboxed', function (test) {
    test.test('constructor', function (test) {
        let body = new TwingNodeText('foo', 1, 1);
        let node = new TwingNodeSandbox(body, 1, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getType(), TwingNodeType.SANDBOX);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let body = new TwingNodeText('foo', 1, 1);
        let node = new TwingNodeSandbox(body, 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
(() => {
    let sandbox = this.extensions.get('TwingExtensionSandbox');
    let alreadySandboxed = sandbox.isSandboxed();
    if (!alreadySandboxed) {
        sandbox.enableSandbox();
    }
    // line 1, column 1
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
