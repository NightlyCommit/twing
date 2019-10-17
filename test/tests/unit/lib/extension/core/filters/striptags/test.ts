import * as tape from 'tape';
import {striptags} from "../../../../../../../../src/lib/extension/core/filters/striptags";

tape('striptags', async (test) => {
    test.same(await striptags('<br/>'), '');

    test.end();
});
