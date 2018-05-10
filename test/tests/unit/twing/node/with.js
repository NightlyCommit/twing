const TwingTestMockCompiler = require('../../../../mock/compiler');
const TwingNodeWith = require('../../../../../lib/twing/node/with').TwingNodeWith;
const TwingNodeType = require('../../../../../lib/twing/node').TwingNodeType;
const TwingNodeExpressionName = require('../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');
const sinon = require('sinon');

tap.test('node/with', function (test) {
    let bodyNode = new TwingNodeExpressionName('foo', 1, 1);
    let variablesNode = new TwingNodeExpressionConstant('bar', 1, 1);

    test.test('constructor', function (test) {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);

        test.same(node.getNode('body'), bodyNode);
        test.same(node.getNode('variables'), variablesNode);
        test.same(node.getType(), TwingNodeType.WITH);

        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeWith(bodyNode, variablesNode, false, 1, 1);
        let compiler = new TwingTestMockCompiler();

        let stub = sinon.stub(compiler, 'getVarName').returns('__internal_fooVar');

        test.same(compiler.compile(node).getSource(), `// line 1, column 1
let __internal_fooVar = "bar";
if (typeof (__internal_fooVar) !== 'object') {
    throw new Twing.TwingErrorRuntime('Variables passed to the "with" tag must be a hash.');
}
context.set('_parent', Twing.clone(context));
context = Twing.merge(context, Twing.iteratorToMap(__internal_fooVar));
// line 1, column 1
(context.has("foo") ? context.get("foo") : null)context = context.get('_parent');
`);

        stub.restore();

        test.end();
    });

    test.end();
});
