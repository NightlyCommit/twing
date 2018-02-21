import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeExpressionAssignName from "../../../../src/node/expression/assign-name";
import TwingNodeImport from "../../../../src/node/import";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/import', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let macro = new TwingNodeExpressionConstant('foo.twig', 1);
        let var_ = new TwingNodeExpressionAssignName('macro', 1);
        let node = new TwingNodeImport(macro, var_, 1);

        test.same(node.getNode('expr'), macro);
        test.same(node.getNode('var'), var_);
        test.same(node.getType(), TwingNodeType.IMPORT);

        test.end();
    });

    test.test('compile', function (test: Test) {
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