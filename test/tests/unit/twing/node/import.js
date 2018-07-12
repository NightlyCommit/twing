const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeExpressionAssignName = require('../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeImport = require('../../../../../lib/twing/node/import').TwingNodeImport;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;

const tap = require('tap');

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

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
context.set(\`macro\`, this.loadTemplate(\`foo.twig\`, null, 1));
`);

        test.end();
    });

    test.end();
});
