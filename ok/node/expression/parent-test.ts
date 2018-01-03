import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionNullCoalesce from "../../../src/node/expression/null-coalesce";
import TwingNodeExpressionName from "../../../src/node/expression/name";
import TwingNodeExpressionConstant from "../../../src/node/expression/constant";
import TwingNodeExpressionParent from "../../../src/node/expression/parent";

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/parent', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let node = new TwingNodeExpressionParent('foo', 1);

        test.equal('foo', node.getAttribute('name'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let node = new TwingNodeExpressionParent('foo', 1);

        nodeTestCase.assertNodeCompilation(test, node,'this.renderParentBlock(\'foo\', context, blocks)');

        test.end();
    });
});