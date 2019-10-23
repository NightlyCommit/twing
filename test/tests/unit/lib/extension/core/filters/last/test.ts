import * as tape from 'tape';
import {CoreTestIterator} from "../../test";
import {last} from "../../../../../../../../src/lib/extension/core/filters/last";

tape('last', async (test) => {
    let i = new Map([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
    ]);

    let twingLastCases = [
        ['c', 'abc'],
        [3, [1, 2, 3]],
        ['', null],
        ['', ''],
        ['c', new CoreTestIterator(i, [...i.keys()], true, 3)]
    ];

    for (let twingLastCase of twingLastCases) {
        test.same(await last(twingLastCase[1]), twingLastCase[0]);
    }

    test.end();
});
