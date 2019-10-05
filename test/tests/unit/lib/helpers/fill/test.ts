import * as tape from 'tape';
import {fill} from "../../../../../../src/lib/helpers/fill";

tape('fill', (test) => {
    test.test('does not replace existing numeric keys', (test) => {
        let map = new Map<any, any>([
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

        map = new Map<any, any>([
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

        map = new Map<any, any>([
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

        map = new Map<any, any>([
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