import * as tape from 'tape';
import {CoreTestIterator} from "../../test";
import {arrayKeys} from "../../../../../../../../src/lib/extension/core/filters/array-keys";

tape('array-keys', async (test) => {
    let map = new Map([
        [1, 'a'],
        [2, 'b'],
        [3, 'c']
    ]);

    let keys = [...map.keys()];

    let arrayKeyCases: [any[], any][] = [
        [keys, map],
        [[0, 1, 2], new CoreTestIterator(map, keys)],
        [[], null]
    ];

    for (let arrayKeyCase of arrayKeyCases) {
        test.same(await arrayKeys(arrayKeyCase[1]), arrayKeyCase[0]);
    }

    test.end();
});
