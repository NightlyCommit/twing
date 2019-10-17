import * as tape from 'tape';
import {trim} from "../../../../../../../../src/lib/extension/core/filters/trim";

tape('trim', async (test) => {
    try {
        await trim('foo', '0', 'bar');

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'Trimming side must be "left", "right" or "both".');
    }

    test.end();
});
