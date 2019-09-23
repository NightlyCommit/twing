const {ksort} = require('../../../../../../build/lib/helpers/ksort');

const tap = require('tape');

tap.test('ksort', (test) => {
    test.test('without handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        ksort(map);

        test.same([...map.keys()], [0, 1]);

        test.end();
    });

    test.test('with handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        ksort(map, (a, b) => {
            return (a > b) ? -1 : 1;
        });

        test.same([...map.keys()], [1, 0]);

        test.end();
    });

    test.end();
});