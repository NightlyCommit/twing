import * as tape from 'tape';
import {cycle} from "../../../../../../../../src/lib/extension/core/functions/cycle";

tape('cycle', (test) => {
    test.same(cycle(1, 0), 1, 'supports non-array input');

    test.end();
});