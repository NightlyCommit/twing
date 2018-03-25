const TwingFunction = require("../../../../lib/twing/function").TwingFunction;
const TwingNode = require("../../../../lib/twing/node").TwingNode;

const tap = require('tap');

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