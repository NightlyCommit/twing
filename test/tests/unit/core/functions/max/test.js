const {twingFunctionMax} = require('../../../../../../build/core/functions/max');

const tap = require('tape');

tap.test('max', function (test) {
    test.same(twingFunctionMax(1, 3, 2), 3);
    test.same(twingFunctionMax('foo', 'bar'), 'foo');
    test.same(twingFunctionMax({foo: 'foo', bar: 'bar'}), 'foo');

    test.end();
});