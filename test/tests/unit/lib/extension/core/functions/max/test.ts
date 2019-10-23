import * as tape from 'tape';
import {max} from "../../../../../../../../src/lib/extension/core/functions/max";

tape('max', async (test) => {
    test.same(await max(1, 3, 2), 3);
    test.same(await max('foo', 'bar'), 'foo');
    test.same(await max({foo: 'foo', bar: 'bar'}), 'foo');

    test.end();
});
