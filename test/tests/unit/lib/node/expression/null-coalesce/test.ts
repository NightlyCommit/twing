import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionName} from "../../../../../../../src/lib/node/expression/name";
import {TwingNodeExpressionNullCoalesce, type} from "../../../../../../../src/lib/node/expression/null-coalesce";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/null-coalesce', (test) => {
    test.test('constructor', function(test) {
        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce([left, right], 1, 1);

        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(),1);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();

        let left = new TwingNodeExpressionName('foo', 1, 1);
        let right = new TwingNodeExpressionConstant(2, 1, 1);
        let node = new TwingNodeExpressionNullCoalesce([left, right], 1, 1);

        test.same(compiler.compile(node).getSource(), `((!!((context.has(\`foo\`)) && !(await this.env.getTest(\'null\').traceableCallable(1, this.getSourceContext())(...[context.get(\`foo\`)])))) ? (context.get(\`foo\`)) : (2))`);
        test.same(node.type, type);
        test.end();
    });

    test.end();
});
