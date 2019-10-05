import * as tape from 'tape';
import {isPureArray} from "../../../../../../src/lib/helpers/is-pure-array";

tape('is-pure-array', (test) => {
    test.same(isPureArray(new Map([[0, 1], [1, 2]])), true);
    test.same(isPureArray(new Map([[1, 1], [2, 2]])), false);
    test.same(isPureArray(new Map([[1, 1], [0, 2]])), false);
    test.same(isPureArray(new Map([[0, 1], [2, 2]])), false);
    test.same(isPureArray(new Map<any, any>([['0', 1], [1, 2]])), true);
    test.same(isPureArray(new Map<any, any>([[0, 1], ['b', 2]])), false);
    test.same(isPureArray(new Map([['a', 1], ['b', 2]])), false);

    test.end();
});