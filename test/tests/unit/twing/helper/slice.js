const tap = require('tap');
const slice = require('../../../../../lib/twing/helper/slice').slice;

tap.test('slice', function (test) {
    let map = new Map([[1, 'foo'], ['bar', 'bar'], [2, 'oof']]);

    test.same(slice(map, 1, 2), new Map([['bar', 'bar'], [0, 'oof']]));
    test.same(slice(map, 1, 2, false), new Map([['bar', 'bar'], [0, 'oof']]));
    test.same(slice(map, 1, 2, true), new Map([['bar', 'bar'], [2, 'oof']]));

    test.end();
});