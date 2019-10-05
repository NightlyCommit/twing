import * as tape from 'tape';
import {max} from "../../../../../../../../src/lib/extension/core/functions/max";

tape('max', (test) => {
    test.same(max(1, 3, 2), 3);
    test.same(max('foo', 'bar'), 'foo');
    test.same(max({foo: 'foo', bar: 'bar'}), 'foo');

    test.end();
});