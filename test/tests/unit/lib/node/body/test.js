const {
    TwingNodeBody,
} = require('../../../../../../build/main');

const tap = require('tape');

tap.test('node/body', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeBody();

        test.same(node.getNodes(), new Map());

        test.end();
    });

    test.end();
});