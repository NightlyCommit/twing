import * as tape from 'tape';
import {empty} from "../../../../../../../../src/lib/extension/core/tests/empty";

tape('empty', (test) => {
    test.true(empty({}));
    test.true(empty({
        toString: () => {
            return '';
        }
    }));
    test.false(empty({foo: ''}));
    test.false(empty({
        toString: () => {
            return 'foo';
        }
    }));

    test.end();
});