import * as tape from 'tape';
import {defaultFilter} from "../../../../../../../../src/lib/extension/core/filters/default";

tape('default', (test) => {
    test.same(defaultFilter(null), '');

    test.end();
});
