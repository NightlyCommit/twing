const {
    TwingNodeSpaceless,
    TwingNodeText,
    TwingNode,
    TwingNodeType
} = require('../../../../../../dist/index');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/spaceless', function (test) {
    test.test('constructor', function (test) {
        let bodyNodes = new Map([
            [0, new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1, 1);

        test.same(node.getNode('body'), body);
        test.same(node.getType(), TwingNodeType.SPACELESS);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let bodyNodes = new Map([
            [0, new TwingNodeText('<div>   <div>   foo   </div>   </div>', 1, 1)]
        ]);

        let body = new TwingNode(bodyNodes);
        let node = new TwingNodeSpaceless(body, 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
Runtime.obStart();
Runtime.echo(\`<div>   <div>   foo   </div>   </div>\`);
Runtime.echo(Runtime.obGetClean().replace(/>\\s+</g, '><').trim());
`);

        test.end();
    });

    test.end();
});
