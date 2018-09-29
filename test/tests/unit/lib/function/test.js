const {
    TwingFunction,
    TwingNode
} = require("../../../../../dist/index");

const tap = require('tape');

tap.test('function', function (test) {
    test.test('getSafe', function (test) {
        let function_ = new TwingFunction('foo', () => {}, {
            is_safe_callback: () => {
                return 'html'
            }
        });

        test.same(function_.getSafe(new TwingNode()), 'html');

        test.end();
    });

    test.end();
});