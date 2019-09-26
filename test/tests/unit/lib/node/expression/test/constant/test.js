const {
    TwingNodeExpressionTestConstant,
    TwingNodeExpressionConstant,
    TwingNodeExpressionArray
} = require('../../../../../../../../dist/cjs/main');

const TwingTestMockCompiler = require('../../../../../../../mock/compiler');

const tap = require('tape');

tap.test('node/expression/test/constant', function (test) {
    test.test('compile', function (test) {
        let node = new TwingNodeExpressionTestConstant(
            new TwingNodeExpressionConstant('foo', 1, 1),
            'constant',
            new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('Foo', 1, 1)]
            ]), 1, 1),
            1, 1
        );
        let compiler = new TwingTestMockCompiler();

        test.same(compiler.compile(node).getSource(), '(`foo` === this.constant(this.env, `Foo`))');

        node = new TwingNodeExpressionTestConstant(
            new TwingNodeExpressionConstant('foo', 1, 1),
            'constant',
            new TwingNodeExpressionArray(new Map([
                [0, new TwingNodeExpressionConstant('Foo', 1, 1)],
                [1, new TwingNodeExpressionConstant('Bar', 1, 1)]
            ]), 1, 1),
            1, 1
        );

        test.same(compiler.compile(node).getSource(), '(`foo` === this.constant(this.env, `Foo`, `Bar`))');

        test.end();
    });

    test.end();
});
