import * as tape from 'tape';
import {first} from "../../../../../../../../src/lib/extension/core/filters/first";
import {CoreTestIterator} from "../../test";

tape('first', async (test) => {
    let i = new Map([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
    ]);

    let twingFirstCases = [
        ['a', 'abc'],
        [1, [1, 2, 3]],
        ['', null],
        ['', ''],
        ['a', new CoreTestIterator(i, [...i.keys()], true, 3)]
    ];

    for (let twingFirstCase of twingFirstCases) {
        test.same(await first(twingFirstCase[1]), twingFirstCase[0]);
    }

    test.end();
});
