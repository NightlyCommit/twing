const tap = require('tap');
const max = require('../../../../../lib/twing/helper/max').max;

tap.test('max', function (test) {
    test.same(max(1, 3, 2), 3);
    test.same(max('foo', 'bar'), 'foo');
    test.same(max({foo: 'foo', bar: 'bar'}), 'foo');

    test.end();
});