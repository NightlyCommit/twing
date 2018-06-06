const tap = require('tap');
const {asort} = require('../../../../../lib/twing/helper/asort');

tap.test('asort', (test) => {
    test.test('without handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        asort(map);

        test.same([...map.values()], ['bar', 'foo']);

        test.end();
    });

    test.test('with handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        asort(map, (a, b) => {
            return (a > b) ? -1 : 1;
        });

        test.same([...map.values()], ['foo', 'bar']);

        test.end();
    });

    test.end();
});