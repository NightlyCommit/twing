const TwingNodeBody = require("../../../../../lib/twing/node/body").TwingNodeBody;

const tap = require('tap');

tap.test('node/body', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeBody();

        test.same(node.getNodes(), new Map());

        test.end();
    });

    test.end();
});