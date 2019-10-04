import * as tape from 'tape';
import {nullTest} from "../../../../../../../../src/lib/extension/core/tests/null";

tape('none', (test) => {
    test.same(nullTest(null), true);

    test.end();
});
