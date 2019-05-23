const {TwingNodeExpressionBinary} = require('../../../../../../build/node/expression/binary');
const {TwingNodeExpressionConstant} = require('../../../../../../build/node/expression/constant');
const {TwingCompiler} = require('../../../../../../build/compiler');
const {TwingEnvironment} = require('../../../../../../build/environment');
const {TwingLoaderArray} = require('../../../../../../build/loader/array');

const tap = require('tape');

class BinaryExpression extends TwingNodeExpressionBinary {

}

tap.test('node/expression/binary', function (test) {
    test.test('compile', function (test) {
        let expr = new BinaryExpression(new TwingNodeExpressionConstant('foo', 1, 1), new TwingNodeExpressionConstant('bar', 1, 1), 1, 1);
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), '(\`foo\`  \`bar\`)');

        test.end();
    });

    test.end();
});