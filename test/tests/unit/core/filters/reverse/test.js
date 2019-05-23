const {twingFilterReverse} = require('../../../../../../build/core/filters/reverse');
const {TwingEnvironmentNode} = require('../../../../../../build/environment/node');

const tap = require('tape');

tap.test('reverse', function (test) {
    let env = new TwingEnvironmentNode(null);
    let map = new Map([[0, 'foo'], ['bar', 'bar']]);

    test.same(twingFilterReverse(env, map), new Map([[0, 'bar'], [1, 'foo']]));
    test.same(twingFilterReverse(env, map, false), new Map([[0, 'bar'], [1, 'foo']]));
    test.same(twingFilterReverse(env, map, true), new Map([['bar', 'bar'], [0, 'foo']]));

    test.end();
});