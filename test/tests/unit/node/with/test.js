const TwingTestMockCompiler = require('../../../../mock/compiler');

const tap = require('tape');
const sinon = require('sinon');
const {TwingNodeWith} = require("../../../../../build/node/with");
const {TwingNodeExpressionName} = require("../../../../../build/node/expression/name");
const {TwingNodeExpressionConstant} = require("../../../../../build/node/expression/constant");
const {TwingNodeType} = require("../../../../../build/node");

tap.test('node/with', function (test) {
    let bodyNode = new TwingNodeExpressionName('foo', 1, 1);
    let variablesNode = new TwingNodeExpressionConstant('bar', 1, 1);

    test.test('constructor', function (test) {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);

        test.same(node.getNode('body'), bodyNode);
        test.same(node.getNode('variables'), variablesNode);
        test.same(node.getType(), TwingNodeType.WITH);
        test.same(node.getTemplateLine(), 1);
        test.same(node.getTemplateColumn(), 1);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);
        let compiler = new TwingTestMockCompiler();

        let stub = sinon.stub(compiler, 'getVarName').returns('__internal_fooVar');

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
let __internal_fooVar = \`bar\`;
if (typeof (__internal_fooVar) !== 'object') {
    throw new Runtime.TwingErrorRuntime('Variables passed to the "with" tag must be a hash.', 1, this.source);
}
context.set('_parent', Runtime.clone(context));
context = Runtime.merge(context, Runtime.iteratorToMap(__internal_fooVar));
(context.has(\`foo\`) ? context.get(\`foo\`) : null)context = context.get('_parent');
`);

        stub.restore();

        test.end();
    });

    test.end();
});
