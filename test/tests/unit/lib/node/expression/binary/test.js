const {
    TwingNodeExpressionBinary,
    TwingCompiler,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeExpressionConstant
} = require('../../../../../../../dist/index');

const tap = require('tape');

class BinaryExpression extends TwingNodeExpressionBinary {

}

tap.test('node/expression/binary', function (test) {
    test.test('compile', function (test) {
        let expr = new BinaryExpression(new TwingNodeExpressionConstant('foo'), new TwingNodeExpressionConstant('bar'), 1);
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), '(\`foo\`  \`bar\`)');

        test.end();
    });

    test.end();
});