const {
    TwingNodeImport,
    TwingNodeType,
    TwingNodeExpressionConstant,
    TwingNodeExpressionAssignName
} = require('../../../../../../build/index');
const TwingTestMockCompiler = require('../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/import', function (test) {
    test.test('constructor', function (test) {
        let macro = new TwingNodeExpressionConstant('foo.twig', 1, 1);
        let var_ = new TwingNodeExpressionAssignName('macro', 1, 1);
        let node = new TwingNodeImport(macro, var_, 1, 1);

        test.same(node.getNode('expr'), macro);
        test.same(node.getNode('var'), var_);
        test.same(node.getType(), TwingNodeType.IMPORT);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let macro = new TwingNodeExpressionConstant('foo.twig', 1, 1);
        let var_ = new TwingNodeExpressionAssignName('macro', 1, 1);
        let node = new TwingNodeImport(macro, var_, 1, 1);
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), `context.proxy[\`macro\`] = this.loadTemplate(\`foo.twig\`, null, 1);
`);

        test.end();
    });

    test.end();
});
