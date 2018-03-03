const TwingTestCompilerStub = require('../../../../compiler-stub');
const TwingNodeExpressionConstant = require('../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingNodeDo = require('../../../../../lib/twing/node/do').TwingNodeDo;
const TwingNodeType = require('../../../../../lib/twing/node-type').TwingNodeType;

const tap = require('tap');

tap.test('node/do', function (test) {
    test.test('constructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeDo(expr, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.DO);

        test.end();
    });

    test.test('compile', function (test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeDo(expr, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
"foo";
`);

        test.end();
    });

    test.end();
});
