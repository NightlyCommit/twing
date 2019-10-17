import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionFilterDefault} from "../../../../../../../../src/lib/node/expression/filter/default";
import {TwingNodeExpressionName} from "../../../../../../../../src/lib/node/expression/name";
import {TwingNode} from "../../../../../../../../src/lib/node";
import {TwingCompiler} from "../../../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../../../src/lib/loader/array";

tape('node/expression/filter/default', (test) => {
    test.test('compile', (test) => {
        test.test('when filter is \`default\` and \`EXPRESSION_NAME\` or \`EXPRESSION_GET_ATTR\` node', (test) => {
            let node = new TwingNodeExpressionFilterDefault(
                new TwingNodeExpressionName('foo', 1, 1),
                new TwingNodeExpressionConstant('default', 1, 1),
                new TwingNode(),
                1, 1
            );

            let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

            test.same(compiler.compile(node).getSource(), `(((context.has(\`foo\`))) ? (await this.env.getFilter('default').traceableCallable(1, this.getSourceContext())(...[(context.has(\`foo\`) ? context.get(\`foo\`) : null)])) : (\`\`))`);

            test.end();
        });

        test.end();
    });

    test.end();
});
