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

        test.same(compiler.compile(node).getSource(), 'await this.traceableRenderParentBlock(1, this.getSourceContext())(\`foo\`, context, blocks)');

        test.test('with special character', (test) => {
            let node = new TwingNodeExpressionParent('£', 1);

            test.same(compiler.compile(node).getSource(), 'await this.traceableRenderParentBlock(1, this.getSourceContext())(\`£\`, context, blocks)');

            test.end();
        });

        test.end();
    });

    test.end();
});
