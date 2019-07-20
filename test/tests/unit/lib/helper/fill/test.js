const {fill} = require('../../../../../../build/lib/helper/fill');

const tap = require('tape');

class TestIterator {
    constructor() {
        this.position = 0;
    }

    next() {
        let r = this.position < 2 ? {
            done: false,
            value: this.position + 10
        } : {
            done: true
        };

        this.position++;

        return r;
    }
}

tap.test('fill', function (test) {
    test.test('does not replace existing numeric keys', function (test) {
        let map = new Map([
            [1, '1'],
            [0, '0'],
            ['foo', 'bar']
        ]);

        fill(map, 5, 'fill');

        test.same(map.size, 5, 'map should contain 5 entries');
        test.same(map.get(0), '0', 'key 0 value should be "0"');
        test.same(map.get(1), '1', 'key 1 value should be "1"');
        test.same(map.get(2), 'fill', 'key 2 value should be "fill"');
        test.same(map.get(3), 'fill', 'key 3 value should be "fill"');

        map = new Map([
            ['1', '1'],
            [0, '0'],
            ['foo', 'bar']
        ]);

        fill(map, 5, 'fill');

        test.same(map.size, 5, 'map should contain 5 entries');
        test.same(map.get(0), '0', 'key 0 value should be "0"');
        test.same(map.get('1'), '1', 'key 1 value should be "1"');
        test.same(map.get(2), 'fill', 'key 2 value should be "fill"');
        test.same(map.get(3), 'fill', 'key 3 value should be "fill"');

        map = new Map([
            [0, '0'],
            [1, '1'],
            ['foo', 'bar'],
            [2, '2'],
        ]);

        fill(map, 5, 'fill');

        test.same(map.size, 5, 'map should contain 5 entries');
        test.same(map.get(0), '0', 'key 0 value should be "0"');
        test.same(map.get(1), '1', 'key 1 value should be "1"');
        test.same(map.get(2), '2', 'key 2 value should be "2"');
        test.same(map.get(3), 'fill', 'key 3 value should be "fill"');

        map = new Map([
            [0, '0'],
            ['foo', 'bar'],
            ['1a2', '1']
        ]);

        fill(map, 5, 'fill');

        test.same(map.size, 5, 'map should contain 5 entries');
        test.same(map.get(0), '0', 'key 0 value should be "0"');
        test.same(map.get('1a2'), '1', 'key "1a2" value should be "1"');
        test.same(map.get(1), 'fill', 'key 1 value should be "fill"');
        test.same(map.get(2), 'fill', 'key 2 value should be "fill"');

        test.end();
    });

    test.end();
});