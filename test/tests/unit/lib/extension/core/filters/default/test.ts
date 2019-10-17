import * as tape from 'tape';
import {defaultFilter} from "../../../../../../../../src/lib/extension/core/filters/default";

tape('default', async (test) => {
    test.same(await defaultFilter(null), '');

    test.end();
});
