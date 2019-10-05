import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionName} from "../../../../../../src/lib/node/expression/name";
import {TwingNodeWith} from "../../../../../../src/lib/node/with";
import {TwingNodeType} from "../../../../../../src/lib/node";
import {MockCompiler} from "../../../../../mock/compiler";

const sinon = require('sinon');

tape('node/with', (test) => {
    let bodyNode = new TwingNodeExpressionName('foo', 1, 1);
    let variablesNode = new TwingNodeExpressionConstant('bar', 1, 1);

    test.test('constructor', (test) => {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);

        test.same(node.getNode('body'), bodyNode);
        test.same(node.getNode('variables'), variablesNode);
        test.same(node.getType(), TwingNodeType.WITH);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', (test) => {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);
        let compiler = new MockCompiler();

        let stub = sinon.stub(compiler, 'getVarName').returns('__internal_fooVar');

        test.same(compiler.compile(node).getSource(), `let __internal_fooVar = \`bar\`;
if (typeof (__internal_fooVar) !== 'object') {
    throw new this.RuntimeError('Variables passed to the "with" tag must be a hash.', 1, this.source);
}
context.set('_parent', context.clone());
context = new this.Context(this.env.mergeGlobals(this.merge(context, this.convertToMap(__internal_fooVar))));
(context.has(\`foo\`) ? context.get(\`foo\`) : null)context = context.get('_parent');
`);

        stub.restore();

        test.end();
    });

    test.end();
});
