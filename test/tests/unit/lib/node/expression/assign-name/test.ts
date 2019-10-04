import * as tape from 'tape';
import {TwingNodeExpressionAssignName} from "../../../../../../../src/lib/node/expression/assign-name";
import {TwingNodeType} from "../../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/assign-name', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeExpressionAssignName('foo', 1, 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_ASSIGN_NAME);
        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        let node = new TwingNodeExpressionAssignName('foo', 1, 1);

        test.same(compiler.compile(node).getSource(), 'context.proxy[\`foo\`]');
        test.end();
    });

    test.end();
});
