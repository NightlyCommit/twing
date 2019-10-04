import * as tape from 'tape';
import {join} from "../../../../../../../../src/lib/extension/core/filters/join";

tape('join', (test) => {
    test.same(join(5, ''), '');
    test.same(join([true, false], ''), '1');

    test.end();
});
