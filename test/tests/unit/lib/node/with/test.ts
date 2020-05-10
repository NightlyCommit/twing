import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionName} from "../../../../../../src/lib/node/expression/name";
import {TwingNodeWith, type} from "../../../../../../src/lib/node/with";
import {MockCompiler} from "../../../../../mock/compiler";

tape('node/with', (test) => {
    let bodyNode = new TwingNodeExpressionName('foo', 1, 1);
    let variablesNode = new TwingNodeExpressionConstant('bar', 1, 1);

    test.test('constructor', (test) => {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);

        test.same(node.getNode('body'), bodyNode);
        test.same(node.getNode('variables'), variablesNode);
        test.same(node.type, type);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);
        let compiler = new MockCompiler();

        test.same(compiler.compile(node).getSource(), `{
    let tmp = \`bar\`;
    if (typeof (tmp) !== 'object') {
        throw new this.RuntimeError('Variables passed to the "with" tag must be a hash.', 1, this.source);
    }
    context.set('_parent', context.clone());
    context = new this.Context(this.environment.mergeGlobals(this.merge(context, this.convertToMap(tmp))));
}

(context.has(\`foo\`) ? context.get(\`foo\`) : null)context = context.get('_parent');
`);

        test.end();
    });

    test.end();
});
