import * as tape from 'tape';
import {nullTest} from "../../../../../../../../src/lib/extension/core/tests/null";

tape('none', async (test) => {
    test.same(await nullTest(null), true);

    test.end();
});
