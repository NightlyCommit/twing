import * as tape from 'tape';
import {CoreTestIterator} from "../../test";
import {slice} from "../../../../../../../../src/lib/extension/core/filters/slice";

tape('sliceFilter', async (test) => {
    let i = new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
    ]);

    let keys = [...i.keys()];

    let sliceFilterCases: [any, any, number, number, boolean][] = [
        [new Map([['a', 1]]), i, 0, 1, true],
        [new Map([['a', 1]]), i, 0, 1, false],
        [new Map([['b', 2], ['c', 3]]), i, 1, 2, undefined],
        [new Map([[0, 1]]), [1, 2, 3, 4], 0, 1, undefined],
        [new Map([[0, 2], [1, 3]]), [1, 2, 3, 4], 1, 2, undefined],
        [new Map([[0, 2], [1, 3]]), new CoreTestIterator(i, keys, true), 1, 2, undefined],
        [i, i, 0, keys.length + 10, true],
        [new Map(), i, keys.length + 10, undefined, undefined],
        ['de', 'abcdef', 3, 2, undefined]
    ];

    for (let sliceFilterCase of sliceFilterCases) {
        let actual = await slice(sliceFilterCase[1], sliceFilterCase[2], sliceFilterCase[3], sliceFilterCase[4]);

        test.same(actual, sliceFilterCase[0]);
    }

    test.end();
});
