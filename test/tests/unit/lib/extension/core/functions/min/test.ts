import * as tape from 'tape';
import {min} from "../../../../../../../../src/lib/extension/core/functions/min";

tape('min', (test) => {
    test.test('supports multiple parameters', (test) => {
        test.same(min(1, 3, 2), 1);

        test.end();
    });

    test.end();
});