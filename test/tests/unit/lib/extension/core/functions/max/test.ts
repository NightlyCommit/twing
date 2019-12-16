import * as tape from 'tape';
import {max} from "../../../../../../../../src/lib/extension/core/functions/max";

tape('max', async (test) => {
    test.same(await max(1, 3, 2), 3);
    test.same(await max('foo', 'bar'), 'foo');
    test.same(await max({foo: 'foo', bar: 'bar'}), 'foo');
    test.same(await max([1, 3, 2]), 3);
    test.same(await max(0, 'a', 2), 2);
    test.same(await max('b', 'a'), 'b');
    test.same(await max('b', 'a', 2), 2);
    test.same(await max('b', 'a', -2), 'b');
    test.same(await max(-5, 5, 10, -10, 20, -20), 20);

    test.end();
});
