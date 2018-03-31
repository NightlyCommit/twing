const TwingNodeExpressionBinary = require('../../../../../../lib/twing/node/expression/binary').TwingNodeExpressionBinary;
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingNodeExpressionConstant = require('../../../../../../lib/twing/node/expression/constant').TwingNodeExpressionConstant;

const tap = require('tap');

class BinaryExpression extends TwingNodeExpressionBinary {

}

tap.test('node/expression/binary', function (test) {
    test.test('compile', function (test) {
        let expr = new BinaryExpression(new TwingNodeExpressionConstant('foo'), new TwingNodeExpressionConstant('bar'), 1);
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), '("foo"  "bar")');

        test.end();
    });

    test.end();
});