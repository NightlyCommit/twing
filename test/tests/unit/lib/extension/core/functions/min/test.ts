import * as tape from 'tape';
import {min} from "../../../../../../../../src/lib/extension/core/functions/min";

tape('min', async (test) => {
    test.same(await min(1, 3, 2), 1);
    test.same(await min([1, 3, 2]), 1);
    test.same(await min(0, 'a', 2), 0);
    test.same(await min('b', 'a'), 'a');
    test.same(await min('b', 'a', 2), 'a');
    test.same(await min('b', 'a', -2), -2);
    test.same(await min(-5, 5, 10, -10, 20, -20), -20);

    test.end();
});
