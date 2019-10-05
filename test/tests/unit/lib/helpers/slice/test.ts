import * as tape from 'tape';
import {slice} from "../../../../../../src/lib/helpers/slice";

tape('slice', (test) => {
    let map = new Map<any, any>([[1, 'foo'], ['bar', 'bar'], [2, 'oof']]);

    test.same(slice(map, 1, 2, false), new Map<any, any>([['bar', 'bar'], [0, 'oof']]));
    test.same(slice(map, 1, 2, true), new Map<any, any>([['bar', 'bar'], [2, 'oof']]));

    test.end();
});