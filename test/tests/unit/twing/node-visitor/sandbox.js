const TwingNodeVisitorSandbox = require("../../../../../lib/twing/node-visitor/sandbox").TwingNodeVisitorSandbox;
const TwingEnvironment = require("../../../../../lib/twing/environment").TwingEnvironment;
const TwingLoaderArray = require("../../../../../lib/twing/loader/array").TwingLoaderArray;
const TwingNodeExpressionConstant = require("../../../../../lib/twing/node/expression/constant").TwingNodeExpressionConstant;

const tap = require('tap');

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