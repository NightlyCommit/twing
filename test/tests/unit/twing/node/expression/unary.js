const TwingNodeExpressionUnary = require('../../../../../../lib/twing/node/expression/unary').TwingNodeExpressionUnary;
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');

class UnaryExpression extends TwingNodeExpressionUnary {

}

tap.test('node/expression/unary', function (test) {
    test.test('compile', function (test) {
        let expr = new UnaryExpression(new TwingNodeExpressionConstant('foo'), 1);
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), ' "foo"');

        test.end();
    });

    test.end();
});