import * as tape from 'tape';
import {includes} from "../../../../../../src/lib/helpers/includes";

tape('includes', (test) => {
    let map = new Map([
        [0, 'a'],
        [1, 'b']
    ]);

    test.true(includes(map, 'a'));
    test.false(includes(map, 'c'));

    test.end();
});
