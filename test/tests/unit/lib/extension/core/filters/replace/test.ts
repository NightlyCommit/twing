import * as tape from 'tape';
import {replace} from "../../../../../../../../src/lib/extension/core/filters/replace";

tape('replace', async (test) => {
    test.same(await replace('foo', null), 'foo');
    test.same(await replace(undefined, null), '');

    test.end();
});
