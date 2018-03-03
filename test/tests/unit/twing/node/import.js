const TwingTestCompilerStub = require('../../../../compiler-stub');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeExpressionAssignName = require('../../../../../lib/twing/node/expression/assign-name').TwingNodeExpressionAssignName;
const TwingNodeImport = require('../../../../../lib/twing/node/import').TwingNodeImport;
const TwingNodeType = require('../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/import', function (test) {
    test.test('constructor', function (test) {
        let macro = new TwingNodeExpressionConstant('foo.twig', 1);
        let var_ = new TwingNodeExpressionAssignName('macro', 1);
        let node = new TwingNodeImport(macro, var_, 1);

        test.same(node.getNode('expr'), macro);
        test.same(node.getNode('var'), var_);
        test.same(node.getType(), TwingNodeType.IMPORT);

        test.end();
    });

    test.test('compile', function (test) {
        let macro = new TwingNodeExpressionConstant('foo.twig', 1);
        let var_ = new TwingNodeExpressionAssignName('macro', 1);
        let node = new TwingNodeImport(macro, var_, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
Twing.getContextProxy(context)["macro"] = this.loadTemplate("foo.twig", null, 1);
`);

        test.end();
    });

    test.end();
});
