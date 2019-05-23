const {TwingNodeExpressionConstant} = require('../../../../../../build/node/expression/constant');
const {TwingNodeExpressionUnary} = require('../../../../../../build/node/expression/unary');
const {TwingCompiler} = require('../../../../../../build/compiler');
const {TwingEnvironment} = require('../../../../../../build/environment');
const {TwingLoaderArray} = require('../../../../../../build/loader/array');

const tap = require('tape');

class UnaryExpression extends TwingNodeExpressionUnary {

}

tap.test('node/expression/unary', function (test) {
    test.test('compile', function (test) {
        let expr = new UnaryExpression(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), ' \`foo\`');

        test.end();
    });

    test.end();
});