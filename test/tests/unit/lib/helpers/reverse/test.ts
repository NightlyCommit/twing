import * as tape from 'tape';
import {reverse} from "../../../../../../src/lib/helpers/reverse";

tape('reverse', (test) => {
    let map = new Map<any, any>([[0, 'foo'], ['bar', 'bar']]);

    test.same(reverse(map, false), new Map([[0, 'bar'], [1, 'foo']]));
    test.same(reverse(map, true), new Map<any, any>([['bar', 'bar'], [0, 'foo']]));

    test.end();
});