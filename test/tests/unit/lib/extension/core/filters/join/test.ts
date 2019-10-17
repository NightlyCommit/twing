import * as tape from 'tape';
import {join} from "../../../../../../../../src/lib/extension/core/filters/join";

tape('join', async (test) => {
    test.same(await join(5, ''), '');
    test.same(await join([true, false], ''), '1');

    test.end();
});
