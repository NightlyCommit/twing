import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../../compiler-stub";
import {TwingNodeExpressionParent} from "../../../../../src/node/expression/parent";
import {TwingNodeType} from "../../../../../src/node-type";

const tap = require('tap');

tap.test('node/expression/parent', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_PARENT);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(compiler.compile(node).getSource(), 'await this.renderParentBlock("foo", context, blocks)');
        test.end();
    });

    test.end();
});
