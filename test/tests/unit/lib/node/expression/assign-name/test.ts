import * as tape from 'tape';
import {TwingNodeExpressionAssignName, type} from "../../../../../../../src/lib/node/expression/assign-name";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/assign-name', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeExpressionAssignName('foo', 1, 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.type, type);
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
