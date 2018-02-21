import {Test} from "tape";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNodeExpressionAssignName from "../../../../../src/node/expression/assign-name";
import TwingNodeType from "../../../../../src/node-type";

const tap = require('tap');

tap.test('node/expression/assign-name', function (test: Test) {
    test.test('constructor', function(test: Test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_ASSIGN_NAME);
        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(compiler.compile(node).getSource(), 'Twing.getContextProxy(context)["foo"]');
        test.end();
    });

    test.end();
});