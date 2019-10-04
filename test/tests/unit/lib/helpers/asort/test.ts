import * as tape from 'tape';
import {asort} from "../../../../../../src/lib/helpers/asort";

tape('asort', (test) => {
    test.test('without handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        asort(map);

        test.same([...map.values()], ['bar', 'foo']);

        test.end();
    });

    test.test('with handler', (test) => {
        let map = new Map([[1, 'foo'], [0, 'bar']]);

        asort(map, (a: any, b: any) => {
            return (a > b) ? -1 : 1;
        });

        test.same([...map.values()], ['foo', 'bar']);

        test.end();
    });

    test.end();
});