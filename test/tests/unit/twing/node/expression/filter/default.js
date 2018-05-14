const TwingNodeExpressionFilterDefault = require('../../../../../../../lib/twing/node/expression/filter/default').TwingNodeExpressionFilterDefault;
const TwingNodeExpressionName = require('../../../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingNodeExpressionConstant = require('../../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingCompiler = require('../../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingNode = require('../../../../../../../lib/twing/node').TwingNode;

const tap = require('tap');

tap.test('node/expression/filter/default', function (test) {
    test.test('compile', function (test) {
        test.test('when filter is "default" and "EXPRESSION_NAME" or "EXPRESSION_GET_ATTR" node', function (test) {
            let node = new TwingNodeExpressionFilterDefault(
                new TwingNodeExpressionName('foo', 1, 1),
                new TwingNodeExpressionConstant('default', 1, 1),
                new TwingNode(),
                1, 1
            );

            let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

            test.same(compiler.compile(node).getSource(), `((// line 1, column 1
(context.has("foo"))) ? (this.env.getFilter('default').getCallable()(...[// line 1, column 1
(context.has("foo") ? context.get("foo") : null)])) : (""))`);

            test.end();
        });

        test.end();
    });

    test.end();
});
