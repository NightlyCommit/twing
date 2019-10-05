import * as tape from 'tape';
import {MockEnvironment} from "../../../../../../../mock/environment";
import {MockLoader} from "../../../../../../../mock/loader";
import {first} from "../../../../../../../../src/lib/extension/core/filters/first";
import {CoreTestIterator} from "../../test";

tape('first', (test) => {
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
        let twing = new MockEnvironment(new MockLoader());

        test.same(first(twing, twingFirstCase[1]), twingFirstCase[0]);
    }

    test.end();
});
