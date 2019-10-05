import * as tape from 'tape';
import {TwingNodeExpressionParent} from "../../../../../../../src/lib/node/expression/parent";
import {TwingNodeType} from "../../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/parent', (test) => {
    test.test('constructor', (test) => {
        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.same(node.getType(), TwingNodeType.EXPRESSION_PARENT);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        let node = new TwingNodeExpressionParent('foo', 1);

        test.same(compiler.compile(node).getSource(), 'this.traceableRenderParentBlock(1, this.source)(\`foo\`, context, blocks)');

        test.test('when name is not valid', (test) => {
            let node = new TwingNodeExpressionParent('£', 1);

            test.same(compiler.compile(node).getSource(), 'this.traceableRenderParentBlock(1, this.source)(\`c2a3\`, context, blocks)');

            test.end();
        });

        test.end();
    });

    test.end();
});
