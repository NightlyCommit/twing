const {includes} = require('../../../../../../dist');

const tap = require('tape');

tap.test('includes', function (test) {
    let map = new Map([
        [0, 'a'],
        [1, 'b']
    ]);

    test.true(includes(map, 'a'));
    test.false(includes(map, 'c'));

    test.end();
});
