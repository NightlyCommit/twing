import * as tape from 'tape';
import {round} from "../../../../../../../../src/lib/extension/core/filters/round";

tape('round', (test) => {
    try {
        round(5, 0, 'foo');

        test.fail();
    }
    catch (e) {
        test.same(e.message, 'The round filter only supports the "common", "ceil", and "floor" methods.');
    }

    test.end();
});
