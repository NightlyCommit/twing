import * as tape from 'tape';
import {empty} from "../../../../../../../../src/lib/extension/core/tests/empty";

tape('empty', async (test) => {
    test.true(await empty({}));
    test.true(await empty({
        toString: () => {
            return '';
        }
    }));
    test.false(await empty({foo: ''}));
    test.false(await empty({
        toString: () => {
            return 'foo';
        }
    }));

    test.end();
});
