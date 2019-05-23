const {twingFilterSlice} = require('../../../../../../build/core/filters/slice');
const {TwingEnvironmentNode} = require('../../../../../../build/environment/node');

const tap = require('tape');

tap.test('slice', function (test) {
    let env = new TwingEnvironmentNode(null);
    let map = new Map([[1, 'foo'], ['bar', 'bar'], [2, 'oof']]);

    test.same(twingFilterSlice(env, map, 1, 2), new Map([['bar', 'bar'], [0, 'oof']]));
    test.same(twingFilterSlice(env, map, 1, 2, false), new Map([['bar', 'bar'], [0, 'oof']]));
    test.same(twingFilterSlice(env, map, 1, 2, true), new Map([['bar', 'bar'], [2, 'oof']]));

    test.end();
});