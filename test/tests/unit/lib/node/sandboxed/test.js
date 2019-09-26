const {
    TwingNodeSandbox,
    TwingNodeText,
    TwingNodeType
} = require('../../../../../../dist/cjs/main');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

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

        test.same(compiler.compile(node).getSource(), `(() => {
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
