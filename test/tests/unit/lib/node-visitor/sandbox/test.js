const {
    TwingNodeVisitorSandbox,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeExpressionConstant
} = require("../../../../../../dist/cjs/main");

const tap = require('tape');

tap.test('node-visitor/sandbox', function (test) {
    test.test('doEnterNode', function (test) {
        test.test('with not "module" node', function(test) {
            let env = new TwingEnvironment(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorSandbox();
            let node = new TwingNodeExpressionConstant('foo', 1, 1);

            test.equals(visitor.doEnterNode(node, env), node, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.end();
});